/**
 * Derive search keywords from lesson.meta.json title + description.
 * Shared by ensure-lesson-keywords.mjs and fill-module-videos.mjs.
 */

const STOPWORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "how", "in",
  "into", "is", "it", "its", "of", "on", "or", "so", "than", "that", "the",
  "their", "them", "then", "there", "these", "they", "this", "to", "vs",
  "was", "we", "what", "when", "where", "which", "who", "will", "with", "you",
  "your", "most", "often", "only", "also", "can", "may", "not", "but", "about",
  "over", "under", "after", "before", "between", "through", "during", "each",
  "other", "some", "such", "more", "many", "much", "very", "just", "like",
  "make", "makes", "made", "use", "used", "using", "uses", "one", "two",
  "same", "new", "old", "first", "later", "still", "keep", "kept", "come",
  "comes", "coming", "should", "would", "could", "does", "did", "have", "has",
  "had", "do", "doing", "done", "get", "gets", "got", "see", "seen", "show",
  "shows", "shown", "brief", "human", "readable", "lesson", "subject",
  "messy", "mystery", "stakeholders", "classic", "especially", "instead",
  "copying", "across", "different", "script", "scripts", "challenge",
  "challenges", "exercises", "backend", "hackerrank", "tools", "common",
]);

/** Topic seeds derived from each lesson title + description (JS fundamentals). */
const LESSON_KEYWORD_SEEDS = {
  "01.1.1-running-javascript-node-js": ["node.js tutorial", "nodejs beginners", "run node", "node.js"],
  "01.1.2-console-log-and-output": ["console.log", "console log", "logging output"],
  "01.1.3-comments": ["javascript comments", "comments in javascript", "single-line comment"],
  "01.2.1-let-and-const": ["let", "const", "var vs let", "block scope"],
  "01.2.2-assignment-and-reassignment": ["assignment operator", "reassignment", "const binding"],
  "01.3.1-strings": ["javascript strings", "string methods", "trim"],
  "01.3.2-numbers": ["javascript numbers", "parseInt", "parseFloat", "Number"],
  "01.3.3-booleans": ["javascript boolean", "true false", "boolean"],
  "01.3.4-undefined-and-null": ["undefined", "null", "undefined vs null"],
  "01.4.1-arithmetic-operators": ["arithmetic operators", "modulo", "remainder"],
  "01.4.2-comparison-operators": ["comparison operators", "greater than", "less than"],
  "01.4.3-logical-operators": ["logical operators", "&&", "||", "not operator"],
  "01.5.1-if-and-else": ["if else", "else if", "conditional"],
  "01.5.2-switch": ["switch statement", "switch case", "break"],
  "01.6.1-for-loop": ["for loop", "for loop javascript"],
  "01.6.2-while-loop": ["while loop", "while loop javascript"],
  "01.7.1-function-declaration": ["function declaration", "declare function"],
  "01.7.2-parameters-and-return-values": ["function parameters", "return value", "return statement"],
  "01.7.3-arrow-functions-and-callbacks": ["arrow function", "callbacks", "arrow functions"],
  "01.7.4-throwing-errors-and-sync-try-catch": ["try catch", "throw error", "try/catch"],
  "01.7.5-function-expressions": ["function expression", "function expressions"],
  "01.7.6-extra-arguments-and-arity": ["function arguments", "arity", "arguments object"],
  "01.7.7-default-parameters": ["default parameters", "default function parameters"],
  "01.7.8-rest-parameters": ["rest parameters", "rest parameter"],
  "01.7.9-function-scope-and-shadowing": ["function scope", "variable shadowing", "shadowing"],
  "01.8.1-truthy-vs-falsy": ["truthy", "falsy", "truthy falsy"],
  "01.8.2-strict-equality": ["strict equality", "===", "triple equals"],
  "01.8.3-type-coercion": ["type coercion", "loose equality", "=="],
  "01.8.4-typeof-and-array-isarray": ["typeof", "Array.isArray", "typeof operator"],
  "01.8.5-null-undefined-null": ["optional chaining", "nullish coalescing", "??", "?.", "== null"],
  "01.9.1-array-literals-indexing-and-length": ["array literal", "array index", "array length"],
  "01.9.2-iterating-arrays-for-and-for-of": ["for of", "iterate array", "for...of"],
  "01.9.3-array-prototype-filter": ["array filter", "filter method"],
  "01.9.4-array-prototype-map": ["array map", "map method"],
  "01.9.5-combining-filter-and-map": ["filter map", "chain filter map"],
  "01.9.6-set-for-uniqueness": ["javascript set", "unique array", "new Set"],
  "01.9.7-mutating-array-methods": ["push pop", "splice", "mutating array", "sort reverse"],
  "01.9.8-other-non-mutating-array-methods": ["slice", "concat", "includes", "find", "indexOf"],
};

const CODE_TOKEN_RE = /(?:Array\.isArray|console\.log|structuredClone|Object\.(?:keys|values|entries|assign|fromEntries|hasOwn)|[a-zA-Z_][\w]*(?:\.[a-zA-Z_][\w]*)+|\?\?|\?\.|===|!==|==|!=|&&|\|\||\.{3}[a-zA-Z_][\w]*)/g;

function normalizePhrase(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/[()[\]{},:;!?./]+$/g, "")
    .replace(/[()[\]{},:;!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\.+$/g, "");
}

function pushUnique(list, value, max) {
  const v = normalizePhrase(value);
  if (!v || v.length < 2) return;
  if (STOPWORDS.has(v)) return;
  if (list.some((k) => normalizePhrase(k) === v)) return;
  if (list.length >= max) return;
  list.push(v);
}

/**
 * Stack / course display name must be first (e.g. "JavaScript" from course.meta.json).
 * Preserves original casing for the stack token.
 */
function pushStackFirst(list, stack, max) {
  const raw = String(stack || "").trim();
  if (!raw) return;
  const key = normalizePhrase(raw);
  if (!key) return;
  if (list.some((k) => normalizePhrase(k) === key)) return;
  if (list.length >= max) {
    list.pop();
  }
  list.unshift(raw);
}

/**
 * @param {{ id?: string, title?: string, description?: string }} meta
 * @param {{ max?: number, stack?: string|null }} [options]
 * @returns {string[]}
 */
export function deriveKeywordsFromMeta(meta, { max = 8, stack = null } = {}) {
  const keywords = [];
  const title = String(meta?.title || "");
  const description = String(meta?.description || "");
  const corpus = `${title}\n${description}`;
  const lessonId = String(meta?.id || "");

  // Required: stack name first (course title, e.g. JavaScript)
  pushStackFirst(keywords, stack, max);

  for (const seed of LESSON_KEYWORD_SEEDS[lessonId] || []) {
    pushUnique(keywords, seed, max);
  }

  pushUnique(keywords, title, max);

  const stackKey = normalizePhrase(stack);
  const codeHits = corpus.match(CODE_TOKEN_RE) || [];
  for (const token of codeHits) {
    const t = token.toLowerCase();
    if (stackKey && t === stackKey) continue;
    pushUnique(keywords, t, max);
  }

  for (const part of normalizePhrase(title).split(" ")) {
    if (stackKey && part === stackKey) continue;
    if (part.length >= 3) pushUnique(keywords, part, max);
  }

  for (const part of normalizePhrase(description).split(" ")) {
    if (stackKey && part === stackKey) continue;
    if (part.length >= 7) pushUnique(keywords, part, max);
  }

  // Guarantee stack stays first even if later logic reordered
  if (stack) pushStackFirst(keywords, stack, max);

  return keywords.slice(0, max);
}

/**
 * Relevance of a YouTube title against lesson keywords.
 * Earlier topic keywords (after stack) weigh more than trailing description noise.
 */
export function scoreVideoTitle(videoTitle, keywords) {
  const hay = normalizePhrase(videoTitle);
  let score = 0;
  let hits = 0;
  let topicHits = 0;

  keywords.forEach((raw, index) => {
    const kw = normalizePhrase(raw);
    if (!kw) return;
    // Stack (index 0) is context; topic seeds (1..3) are the core match signal
    const weight = index === 0 ? 0.35 : index <= 3 ? 1.4 : index <= 5 ? 1.0 : 0.55;
    if (hay.includes(kw)) {
      hits += 1;
      if (index >= 1 && index <= 3) topicHits += 1;
      score += (20 + Math.min(kw.length, 24)) * weight;
      return;
    }
    const parts = kw.split(" ").filter((p) => p.length >= 3 && !STOPWORDS.has(p));
    let partHits = 0;
    for (const p of parts) {
      if (hay.includes(p)) partHits += 1;
    }
    if (partHits > 0) {
      score += partHits * 4 * weight;
      if (parts.length > 0 && partHits >= Math.ceil(parts.length * 0.6)) {
        hits += 1;
        if (index >= 1 && index <= 3) topicHits += 1;
      }
    }
  });

  if (topicHits === 0) score -= 20;

  if (/\b(full course|complete course|crash course|\d+\s*hours?|\d+\s*hour)\b/.test(hay) && hits < 2) {
    score -= 25;
  }
  if (/\b(100 seconds|in \d+ minutes)\b/.test(hay) && topicHits < 1) {
    score -= 10;
  }

  return { score, hits, topicHits };
}
