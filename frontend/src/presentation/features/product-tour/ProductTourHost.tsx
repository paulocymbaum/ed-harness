import { useEffect, useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "react-router-dom";
import { useProductTourStore } from "../../../application/stores/productTourStore";
import { useLocaleStore } from "../../../application/stores/localeStore";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { isAppLocale } from "../../../domain/types/locale";
import { Button } from "../../design-system";
import { PRODUCT_TOUR_STEPS } from "./tourSteps";

type Rect = { top: number; left: number; width: number; height: number };

function readTargetRect(selector: string): Rect | null {
  const el = document.querySelector(selector);
  if (!(el instanceof HTMLElement)) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 2 && r.height < 2) return null;
  const pad = 8;
  return {
    top: Math.max(0, r.top - pad),
    left: Math.max(0, r.left - pad),
    width: Math.min(window.innerWidth - Math.max(0, r.left - pad), r.width + pad * 2),
    height: r.height + pad * 2,
  };
}

const TOUR_PENDING_KEY = "ed-harness-start-tour";

function LandingEntryBootstrap() {
  const [, setSearchParams] = useSearchParams();
  const setLocale = useLocaleStore((s) => s.setLocale);
  const start = useProductTourStore((s) => s.start);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");
    const tour = params.get("tour");
    let dirty = false;

    if (isAppLocale(lang)) {
      setLocale(lang);
      params.delete("lang");
      dirty = true;
    }

    if (tour === "1" || tour === "true") {
      try {
        sessionStorage.setItem(TOUR_PENDING_KEY, "1");
      } catch {
        /* ignore */
      }
      params.delete("tour");
      dirty = true;
    }

    if (dirty) setSearchParams(params, { replace: true });

    let pending = false;
    try {
      pending = sessionStorage.getItem(TOUR_PENDING_KEY) === "1";
    } catch {
      pending = false;
    }

    if (!pending) return;

    const timer = window.setTimeout(() => {
      try {
        sessionStorage.removeItem(TOUR_PENDING_KEY);
      } catch {
        /* ignore */
      }
      start();
    }, 280);

    return () => window.clearTimeout(timer);
  }, [setLocale, setSearchParams, start]);

  return null;
}

function TourOverlay() {
  const { t } = useTranslation();
  const active = useProductTourStore((s) => s.active);
  const stepIndex = useProductTourStore((s) => s.stepIndex);
  const next = useProductTourStore((s) => s.next);
  const prev = useProductTourStore((s) => s.prev);
  const skip = useProductTourStore((s) => s.skip);
  const [rect, setRect] = useState<Rect | null>(null);

  const step = PRODUCT_TOUR_STEPS[stepIndex];
  const stepCount = PRODUCT_TOUR_STEPS.length;
  const isLast = stepIndex >= stepCount - 1;

  useLayoutEffect(() => {
    if (!active || !step) {
      setRect(null);
      return;
    }

    let pollId = 0;

    const update = () => {
      const nextRect = readTargetRect(step.target);
      setRect(nextRect);
      const el = document.querySelector(step.target);
      if (el instanceof HTMLElement) {
        el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
      }
      return Boolean(nextRect);
    };

    if (!update()) {
      pollId = window.setInterval(() => {
        if (update()) window.clearInterval(pollId);
      }, 120);
    }

    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      if (pollId) window.clearInterval(pollId);
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [active, step]);

  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") skip();
      if (event.key === "ArrowRight") next(stepCount);
      if (event.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, next, prev, skip, stepCount]);

  if (!active || !step) return null;

  const popoverTop = rect ? Math.min(rect.top + rect.height + 12, window.innerHeight - 220) : 24;
  const popoverLeft = rect
    ? Math.min(Math.max(16, rect.left), window.innerWidth - 336)
    : 16;

  return createPortal(
    <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-labelledby="product-tour-title">
      <button
        type="button"
        className="absolute inset-0 cursor-default border-0 bg-transparent p-0"
        aria-label={t("tour.skip")}
        onClick={skip}
      />

      {rect ? (
        <div
          className="pointer-events-none absolute rounded-panel ring-2 ring-accent0 shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]"
          style={{
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
          }}
        />
      ) : (
        <div className="pointer-events-none absolute inset-0 bg-black/55" aria-hidden />
      )}

      <div
        className="absolute z-10 w-[min(100vw-2rem,20rem)] rounded-panel border border-border0 bg-surfacePanel p-4 text-text0 shadow-glass2"
        style={{ top: popoverTop, left: popoverLeft }}
      >
        <p className="m-0 text-meta text-text1">
          {t("tour.progress", { current: stepIndex + 1, total: stepCount })}
        </p>
        <h2 id="product-tour-title" className="m-0 mt-1 text-body font-semibold">
          {t(step.titleKey)}
        </h2>
        <p className="m-0 mt-2 text-meta text-text1">{t(step.bodyKey)}</p>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <Button type="button" size="sm" variant="ghost" onClick={skip}>
            {t("tour.skip")}
          </Button>
          <div className="flex gap-2">
            <Button type="button" size="sm" variant="secondary" onClick={prev} disabled={stepIndex === 0}>
              {t("tour.back")}
            </Button>
            <Button type="button" size="sm" variant="primary" onClick={() => next(stepCount)}>
              {isLast ? t("tour.done") : t("tour.next")}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function ProductTourHost() {
  return (
    <>
      <LandingEntryBootstrap />
      <TourOverlay />
    </>
  );
}
