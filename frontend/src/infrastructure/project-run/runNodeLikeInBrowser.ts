const DEFAULT_TIMEOUT_MS = 5000;
const MAX_OUTPUT = 65_536;

export type BrowserNodeRunResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
  timedOut: boolean;
};

/**
 * Runs CommonJS-style Node stdin/stdout starters in a Web Worker.
 * Supports process.stdin/stdout and readline / node:readline.
 */
export function runNodeLikeInBrowser(
  code: string,
  stdin: string,
  timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<BrowserNodeRunResult> {
  return new Promise((resolve) => {
    const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
    const url = URL.createObjectURL(blob);
    const worker = new Worker(url);
    let settled = false;

    const finish = (result: BrowserNodeRunResult) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(result);
    };

    const timer = setTimeout(() => {
      finish({ stdout: "", stderr: "", exitCode: 1, timedOut: true });
    }, timeoutMs);

    worker.onmessage = (event: MessageEvent) => {
      const data = event.data as Partial<BrowserNodeRunResult> | null;
      finish({
        stdout: typeof data?.stdout === "string" ? cap(data.stdout) : "",
        stderr: typeof data?.stderr === "string" ? cap(data.stderr) : "",
        exitCode: typeof data?.exitCode === "number" ? data.exitCode : 1,
        timedOut: Boolean(data?.timedOut),
      });
    };

    worker.onerror = (event) => {
      finish({
        stdout: "",
        stderr: event.message || "Worker failed",
        exitCode: 1,
        timedOut: false,
      });
    };

    worker.postMessage({ code, stdin: ensureTrailingNewline(stdin) });
  });
}

function ensureTrailingNewline(text: string): string {
  if (!text) return "\n";
  return text.endsWith("\n") ? text : `${text}\n`;
}

function cap(text: string): string {
  if (text.length <= MAX_OUTPUT) return text;
  return `${text.slice(0, MAX_OUTPUT)}\n… (output truncated)`;
}

const WORKER_SOURCE = `
self.onmessage = (event) => {
  const { code, stdin } = event.data || {};
  let stdout = "";
  let stderr = "";
  let exitCode = 0;
  let finished = false;

  const finish = (codeValue) => {
    if (finished) return;
    finished = true;
    exitCode = typeof codeValue === "number" ? codeValue : exitCode;
    self.postMessage({ stdout, stderr, exitCode, timedOut: false });
  };

  const listeners = { data: [], end: [], line: [], close: [] };
  const stdinState = { ended: false, encoding: "utf8" };

  const emit = (type, payload) => {
    for (const listener of listeners[type] || []) {
      try { listener(payload); } catch (err) {
        stderr += String(err && err.stack ? err.stack : err) + "\\n";
        exitCode = 1;
      }
    }
  };

  const stdinStream = {
    setEncoding() { return stdinStream; },
    on(event, listener) {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(listener);
      return stdinStream;
    },
    once(event, listener) {
      const wrap = (...args) => {
        stdinStream.off(event, wrap);
        listener(...args);
      };
      return stdinStream.on(event, wrap);
    },
    off(event, listener) {
      listeners[event] = (listeners[event] || []).filter((item) => item !== listener);
      return stdinStream;
    },
    removeListener(event, listener) { return stdinStream.off(event, listener); },
    isTTY: false,
  };

  const processPolyfill = {
    stdin: stdinStream,
    stdout: {
      write(chunk) {
        stdout += chunk == null ? "" : String(chunk);
        return true;
      },
    },
    stderr: {
      write(chunk) {
        stderr += chunk == null ? "" : String(chunk);
        return true;
      },
    },
    exit(codeValue) {
      finish(typeof codeValue === "number" ? codeValue : 0);
    },
  };

  function createInterface(options) {
    const input = options && options.input ? options.input : stdinStream;
    const lineListeners = [];
    const closeListeners = [];
    let buffer = "";
    let closed = false;

    const onData = (chunk) => {
      buffer += chunk == null ? "" : String(chunk);
      const parts = buffer.split(/\\r?\\n/);
      buffer = parts.pop() || "";
      for (const line of parts) {
        for (const listener of lineListeners) listener(line);
      }
    };

    const onEnd = () => {
      if (buffer.length) {
        for (const listener of lineListeners) listener(buffer);
        buffer = "";
      }
      closeInterface();
    };

    const closeInterface = () => {
      if (closed) return;
      closed = true;
      input.off("data", onData);
      input.off("end", onEnd);
      for (const listener of closeListeners) listener();
    };

    input.on("data", onData);
    input.on("end", onEnd);

    return {
      on(event, listener) {
        if (event === "line") lineListeners.push(listener);
        if (event === "close") closeListeners.push(listener);
        return this;
      },
      close: closeInterface,
    };
  }

  const readlineModule = { createInterface };
  const requireFn = (id) => {
    if (id === "readline" || id === "node:readline") return readlineModule;
    throw new Error("Cannot find module '" + id + "'");
  };

  const moduleObj = { exports: {} };
  const consolePolyfill = {
    log(...args) { stdout += args.map(String).join(" ") + "\\n"; },
    error(...args) { stderr += args.map(String).join(" ") + "\\n"; },
    warn(...args) { stderr += args.map(String).join(" ") + "\\n"; },
  };

  try {
    const runner = new Function(
      "require",
      "module",
      "exports",
      "process",
      "console",
      code + "\\n;",
    );
    runner(requireFn, moduleObj, moduleObj.exports, processPolyfill, consolePolyfill);

    queueMicrotask(() => {
      if (stdinState.ended) return;
      stdinState.ended = true;
      emit("data", stdin);
      emit("end");
      // Allow pending line handlers a tick before finishing.
      queueMicrotask(() => finish(exitCode));
    });
  } catch (err) {
    stderr += String(err && err.stack ? err.stack : err) + "\\n";
    finish(1);
  }
};
`;
