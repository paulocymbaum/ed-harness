---
name: add-lesson-youtube-videos
description: >-
  Finds relevant YouTube videos using lesson.meta.json keywords and writes them
  as a videos array ({url, title, views}). Use when filling or refreshing
  YouTube links for a module/lesson, adding keywords for video search, or
  updating lesson video resources in lesson.meta.json.
---

# Add Lesson YouTube Videos

Fill study lessons with up to **2** **topic-relevant** YouTube videos each. Skip modules whose folder id ends in `-mock`.

Relevance beats view count: pick videos whose titles match lesson `keywords`, not just the most-watched results.

## Quick start (module fill)

1. **Ensure keywords** (from title + description; topic seeds per lesson id):

```bash
node .cursor/skills/add-lesson-youtube-videos/scripts/ensure-lesson-keywords.mjs \
  --course javascript --module 01-javascript-fundamentals --force
```

2. **List coverage**:

```bash
node .cursor/skills/add-lesson-youtube-videos/scripts/list-module-lessons.mjs --course javascript --module 01-javascript-fundamentals
```

3. **Search + write** (keyword queries, relevance-ranked; `--all` overwrites):

```bash
node .cursor/skills/add-lesson-youtube-videos/scripts/fill-module-videos.mjs \
  --course javascript --module 01-javascript-fundamentals --all
```

Or write one lesson manually:

```bash
node .cursor/skills/add-lesson-youtube-videos/scripts/set-lesson-videos.mjs \
  --course javascript \
  --module 01-javascript-fundamentals \
  --lesson 01.1.1-running-javascript-node-js \
  --videos '[{"url":"https://www.youtube.com/watch?v=VIDEO_ID","title":"Clear video title","views":2500000}]'
```

## Workflow checklist

```
- [ ] ensure-lesson-keywords.mjs run (keywords present)
- [ ] Skipped any *-mock module
- [ ] Search used keywords (yt-dlp or web search) — no invented URLs
- [ ] URLs are youtube.com/watch or youtu.be
- [ ] ≤ 2 videos per lesson, relevance-first (views as tie-breaker)
- [ ] set-lesson-videos / fill-module-videos wrote meta
- [ ] list-module-lessons shows expected coverage
```

## Selection rules

| Rule | Detail |
|------|--------|
| Keywords | Required for good search — store in `lesson.meta.json` |
| Relevance | Video title must match lesson keywords; drop weak hits |
| Viewership | Tie-breaker only among relevant candidates |
| Count | 1–2 entries; omit rather than pad |
| Language | Prefer English unless the lesson/course language clearly differs |

## Meta shape

```json
"keywords": ["JavaScript", "node.js", "stdin", "stdout"],
"videos": [
  {
    "url": "https://www.youtube.com/watch?v=VIDEO_ID",
    "title": "Human-readable title from the video",
    "views": 2500000
  }
]
```

## Scripts

| Script | Purpose |
|--------|---------|
| [scripts/ensure-lesson-keywords.mjs](scripts/ensure-lesson-keywords.mjs) | Derive/write `keywords` from title + description |
| [scripts/list-module-lessons.mjs](scripts/list-module-lessons.mjs) | List lessons + videos coverage |
| [scripts/set-lesson-videos.mjs](scripts/set-lesson-videos.mjs) | Validate and write `videos` |
| [scripts/fill-module-videos.mjs](scripts/fill-module-videos.mjs) | Batch keyword search (`yt-dlp`) + relevance pick |
| [scripts/keywords-from-meta.mjs](scripts/keywords-from-meta.mjs) | Shared keyword derive + relevance scoring |

## Additional resources

- Field contract: [reference.md](reference.md)
- Schema: `docs/meta-schemas.md` (`keywords`, `videos`)
