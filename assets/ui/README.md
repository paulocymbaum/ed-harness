# UI screenshots

Viewport captures of the EdHarness learner flow (1440×900, dark theme).

| File | What it shows |
|------|----------------|
| `01-catalog.png` | Catalog home |
| `02-content-map.png` | Content map (`/?tab=content-map&course=javascript`) |
| `03-course-overview.png` | Course overview |
| `04-module.png` | Study module + contents drawer |
| `05-lesson.png` | Lesson explanation |
| `06-quiz.png` | Quiz focus session |
| `07-project.png` | Project delivery |
| `08-mock-test-overview.png` | Mock test overview |
| `09-mock-test-quiz.png` | Mock test MCQ |
| `10-mock-test-coding.png` | Mock test coding |
| `11-language-selector.png` | Language picker open (`en` / `pt` / `es` / `zh`) |
| `12-language-portuguese.png` | Catalog chrome after switching to Portuguese |
| `13-pomodoro.png` | Pomodoro running with control panel open |

Regenerate (with Vite running on `http://localhost:5173`):

```bash
npm install --no-save playwright@1.49.1
npx playwright install chromium
npm run ui:snapshots
```

See `manifest.json` for the last capture metadata.
