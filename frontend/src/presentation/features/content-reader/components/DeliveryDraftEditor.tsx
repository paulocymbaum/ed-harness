import { useMemo, useRef, type KeyboardEvent } from "react";
import clsx from "clsx";
import {
  countLines,
  insertNewlineWithIndent,
} from "./deliveryDraftEditorUtils";

export function DeliveryDraftEditor(props: {
  id: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  className?: string;
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);
  const lineCount = useMemo(() => countLines(props.value), [props.value]);
  const lineNumbers = useMemo(
    () => Array.from({ length: lineCount }, (_, index) => index + 1),
    [lineCount],
  );

  const syncGutterScroll = () => {
    const textarea = textareaRef.current;
    const gutter = gutterRef.current;
    if (!textarea || !gutter) return;
    gutter.scrollTop = textarea.scrollTop;
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== "Enter" || event.nativeEvent.isComposing) return;
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    event.preventDefault();
    const el = event.currentTarget;
    const { value, caret } = insertNewlineWithIndent(
      el.value,
      el.selectionStart,
      el.selectionEnd,
    );
    props.onChange(value);
    requestAnimationFrame(() => {
      const next = textareaRef.current;
      if (!next) return;
      next.selectionStart = caret;
      next.selectionEnd = caret;
      syncGutterScroll();
    });
  };

  return (
    <div
      className={clsx(
        "flex min-h-[14rem] overflow-hidden rounded-panel border border-border0 bg-surfaceControl shadow-glass1",
        "focus-within:ring-2 focus-within:ring-accent0/60 focus-within:ring-offset-2 focus-within:ring-offset-transparent",
        props.className,
      )}
    >
      <div
        ref={gutterRef}
        aria-hidden
        className="shrink-0 select-none overflow-hidden border-r border-border0 bg-surfacePanel/70 py-2 pl-2 pr-2 text-right font-mono text-meta leading-[1.5] text-text2"
      >
        {lineNumbers.map((line) => (
          <div key={line} className="min-h-[1.5em]">
            {line}
          </div>
        ))}
      </div>

      <textarea
        ref={textareaRef}
        id={props.id}
        rows={props.rows ?? 12}
        value={props.value}
        placeholder={props.placeholder}
        spellCheck={false}
        onChange={(event) => props.onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        onScroll={syncGutterScroll}
        className={clsx(
          "min-h-[14rem] min-w-0 flex-1 resize-y border-0 bg-transparent px-3 py-2 font-mono text-meta leading-[1.5] text-text0 shadow-none",
          "placeholder:text-text2",
          "focus-visible:outline-none",
          "disabled:cursor-not-allowed disabled:opacity-50",
        )}
      />
    </div>
  );
}
