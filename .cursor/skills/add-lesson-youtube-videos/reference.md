# Lesson YouTube videos — reference

## Field contract

`lesson.meta.json` may include:

```json
{
  "keywords": ["JavaScript", "truthy", "falsy", "truthy falsy"],
  "videos": [
    {
      "url": "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "title": "Example Title",
      "views": 1000000
    }
  ]
}
```

### `keywords`

| Constraint | Rule |
|------------|------|
| Type | `string[]` |
| Purpose | Drive YouTube search queries and relevance scoring |
| Stack first | First entry is the course stack name from `course.meta.json` `title` (e.g. `JavaScript`) |
| Source | Stack + title + description (`ensure-lesson-keywords.mjs`) |

### `videos`

| Constraint | Rule |
|------------|------|
| Max length | 2 |
| `url` | `https://www.youtube.com/watch?v=...` or `https://youtu.be/...` |
| `title` | Non-empty string |
| `views` | Finite number ≥ 0 |
| Order | Highest **relevance** first (views only break ties) |

Study lessons only. Do not add `keywords`/`videos` to mock section lessons or modules ending in `-mock`.

## Search + ranking

1. Prefer queries built from `keywords` (not the bare lesson title alone).
2. Score each candidate title with `scoreVideoTitle` (keyword hits).
3. Keep only videos with sufficient hits/score; sort by score, then views.
4. Take at most **2**. Drop weak matches instead of padding.

## CLI

### `ensure-lesson-keywords.mjs`

```bash
node .cursor/skills/add-lesson-youtube-videos/scripts/ensure-lesson-keywords.mjs \
  --course javascript --module 01-javascript-fundamentals --force
```

### `fill-module-videos.mjs`

```bash
node .cursor/skills/add-lesson-youtube-videos/scripts/fill-module-videos.mjs \
  --course javascript --module 01-javascript-fundamentals --all
```

### `set-lesson-videos.mjs`

```bash
node .cursor/skills/add-lesson-youtube-videos/scripts/set-lesson-videos.mjs \
  --course <course> --module <module> --lesson <lesson-id> \
  --videos '<json-array>'
```
