/**
 * Promise Order Labeler
 * node starter/index.js < starter/sample.input
 */

function classifyTokens(tokens) {
  // TODO: bucket tokens into { sync: [...], micro: [...], macro: [...] }
  // preserving encounter order within each bucket.
  // throw new Error("invalid token") for anything that isn't sync/micro/macro
  throw new Error("Not implemented");
}

function main() {
  let data = "";
  process.stdin.setEncoding("utf8");
  process.stdin.on("data", (chunk) => (data += chunk));
  process.stdin.on("end", () => {
    const tokens = data.trim().split(/\s+/).filter(Boolean);

    let buckets;
    try {
      buckets = classifyTokens(tokens);
    } catch {
      process.stdout.write("ERROR: invalid token\n");
      return;
    }

    // TODO: print buckets.sync, then buckets.micro, then buckets.macro, one token per line
    process.stdout.write("Not implemented yet\n");
  });
}

main();
