/**
 * Captures viewport screenshots of the main learner UI flow into assets/ui/.
 * Requires the Vite dev server at BASE_URL (default http://localhost:5173).
 *
 * Usage: node scripts/capture-ui-snapshots.mjs
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const outDir = path.join(root, "assets", "ui");
const baseUrl = process.env.BASE_URL || "http://localhost:5173";

const shots = [
  {
    file: "01-catalog.png",
    path: "/",
    caption: "Catalog home — dashboard, course cards, pending projects",
  },
  {
    file: "02-content-map.png",
    path: "/?tab=content-map&course=javascript",
    caption: "Content map — curriculum graph with progress",
    waitFor: "svg",
    waitMs: 1500,
    prepare: "content-map",
  },
  {
    file: "03-course-overview.png",
    path: "/course/javascript",
    caption: "Course overview — modules and mock tests",
    prepare: "course-overview",
  },
  {
    file: "04-module.png",
    path: "/course/javascript/module/01-javascript-fundamentals",
    caption: "Study module — README + contents drawer",
  },
  {
    file: "05-lesson.png",
    path: "/course/javascript/module/01-javascript-fundamentals/lesson/01.1.1-running-javascript-node-js",
    caption: "Lesson — predict-first explanation",
    prepare: "lesson",
  },
  {
    file: "06-quiz.png",
    path: "/course/javascript/module/01-javascript-fundamentals/lesson/01.8.1-truthy-vs-falsy/quiz/quiz",
    caption: "Quiz focus session",
  },
  {
    file: "07-project.png",
    path: "/course/javascript/module/01-javascript-fundamentals/lesson/01.8.1-truthy-vs-falsy/project/001-cli-input-validator",
    caption: "Project focus — delivery and Run answer",
    waitMs: 800,
  },
  {
    file: "08-mock-test-overview.png",
    path: "/course/javascript/module/01-javascript-fundamentals-mock/mock-test",
    caption: "Mock test overview — start screen",
  },
  {
    file: "09-mock-test-quiz.png",
    path: "/course/javascript/module/01-javascript-fundamentals-mock/mock-test/section/01.2-multiple-choice",
    caption: "Mock test — multiple choice section",
  },
  {
    file: "10-mock-test-coding.png",
    path: "/course/javascript/module/01-javascript-fundamentals-mock/mock-test/section/01.3-coding-challenge",
    caption: "Mock test — coding challenge section",
    waitMs: 800,
  },
  {
    file: "11-language-selector.png",
    path: "/",
    caption: "Language picker — en / pt / es / zh",
    prepare: "language-selector",
  },
  {
    file: "12-language-portuguese.png",
    path: "/",
    caption: "Catalog chrome in Portuguese",
    prepare: "language-portuguese",
  },
  {
    file: "13-pomodoro.png",
    path: "/",
    caption: "Pomodoro running with panel open",
    prepare: "pomodoro",
  },
];

async function dismissOverlays(page) {
  await page.evaluate(() => {
    try {
      sessionStorage.removeItem("ed-harness-start-tour");
      localStorage.removeItem("ed-harness-start-tour");
    } catch {
      /* ignore */
    }
    const dialog = document.querySelector('[role="dialog"][aria-labelledby="product-tour-title"]');
    if (dialog) {
      const skip = [...dialog.querySelectorAll("button")].find((b) =>
        /skip|pular|omitir|done|concluir/i.test(b.textContent || ""),
      );
      skip?.click();
    }
  });
}

async function main() {
  await mkdir(outDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    colorScheme: "dark",
    locale: "en-US",
  });
  const page = await context.newPage();

  // Warm locale + theme before captures
  await page.goto(`${baseUrl}/?lang=en`, { waitUntil: "networkidle" });
  await dismissOverlays(page);
  await page.evaluate(() => {
    try {
      localStorage.setItem("ed-harness-theme", "dark");
      localStorage.setItem("ed-harness-locale", "en");
    } catch {
      /* ignore */
    }
  });

  const manifest = [];

  for (const shot of shots) {
    const url = `${baseUrl}${shot.path}`;
    await page.goto(url, { waitUntil: "networkidle" });
    await dismissOverlays(page);
    if (shot.waitFor) {
      await page.waitForSelector(shot.waitFor, { timeout: 10000 }).catch(() => null);
    }
    if (shot.waitMs) await page.waitForTimeout(shot.waitMs);

    if (shot.prepare === "content-map") {
      await page.waitForSelector("[data-mindmap-viewport]", { timeout: 8000 }).catch(() => null);
      await page.waitForTimeout(600);
      // Fully expanded trees are taller than the viewport; show course → modules.
      const collapse = page.getByRole("button", { name: /collapse all/i });
      if (await collapse.count()) await collapse.click();
      await page.waitForTimeout(350);
      const center = page.getByRole("button", { name: /center view/i });
      if (await center.count()) await center.click();
      await page.waitForTimeout(350);
      const expandBranch = page.getByRole("button", { name: /expand branch/i });
      if (await expandBranch.count()) await expandBranch.first().click();
      await page.waitForTimeout(500);
      if (await center.count()) await center.click();
      await page.waitForTimeout(500);
    }

    if (shot.prepare === "course-overview") {
      // Prefer a frame that includes the Mock tests list when present
      const mockHeading = page.getByRole("heading", { name: /mock tests/i });
      if (await mockHeading.count()) {
        await mockHeading.first().scrollIntoViewIfNeeded();
        await page.waitForTimeout(200);
        await page.evaluate(() => window.scrollBy(0, -120));
      }
    }

    if (shot.prepare === "lesson") {
      // Hide video accordion so the README explanation is the visual focus
      await page.evaluate(() => {
        const videos = document.querySelector('[aria-label*="ideo" i], [aria-label*="Videos" i]');
        if (videos instanceof HTMLElement) videos.style.display = "none";
        const heading = document.querySelector("article h1, main h1, .prose h1, h1");
        heading?.scrollIntoView({ block: "start" });
      });
      await page.waitForTimeout(200);
    }

    if (shot.prepare === "language-selector") {
      await page.evaluate(() => {
        try {
          localStorage.setItem("ed-harness-locale", "en");
        } catch {
          /* ignore */
        }
      });
      await page.goto(`${baseUrl}/?lang=en`, { waitUntil: "networkidle" });
      await dismissOverlays(page);
      await page.getByRole("button", { name: /language|idioma|语言/i }).click();
      await page.waitForSelector('[role="listbox"]');
      await page.waitForTimeout(250);
    }

    if (shot.prepare === "language-portuguese") {
      await page.goto(`${baseUrl}/?lang=pt`, { waitUntil: "networkidle" });
      await dismissOverlays(page);
      await page.waitForTimeout(500);
    }

    if (shot.prepare === "pomodoro") {
      await page.goto(`${baseUrl}/?lang=en`, { waitUntil: "networkidle" });
      await dismissOverlays(page);
      await page.evaluate(() => {
        try {
          localStorage.setItem("ed-harness-locale", "en");
        } catch {
          /* ignore */
        }
      });
      const pomo = page.locator('[data-tour="pomodoro"]');
      // Idle click starts the timer; second click opens the running panel
      await pomo.click();
      await page.waitForTimeout(350);
      await pomo.click();
      await page.getByText(/time remaining|tempo restante|tiempo restante|剩余/i).waitFor({
        timeout: 5000,
      });
      await page.waitForTimeout(250);
    }

    await page.waitForTimeout(300);
    const outPath = path.join(outDir, shot.file);
    await page.screenshot({ path: outPath, fullPage: false });
    console.log(`Wrote ${path.relative(root, outPath)}  ← ${shot.path}`);
    manifest.push({
      file: shot.file,
      path: shot.path,
      caption: shot.caption,
      url: `assets/ui/${shot.file}`,
    });
  }

  await writeFile(
    path.join(outDir, "manifest.json"),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), baseUrl, shots: manifest }, null, 2)}\n`,
  );
  console.log(`Manifest: assets/ui/manifest.json (${manifest.length} shots)`);
  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
