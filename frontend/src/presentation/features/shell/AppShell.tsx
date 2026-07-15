import { useEffect } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { usePomodoroTimer } from "../../../application/hooks/usePomodoroTimer";
import { useLocaleStore } from "../../../application/stores/localeStore";
import { useThemeStore, applyThemeToDocument } from "../../../application/stores/themeStore";
import { applyLocaleToDocument } from "../../../infrastructure/i18n/applyLocaleToDocument";
import { syncLocaleToCursorConfig } from "../../../infrastructure/i18n/syncLocaleToCursorConfig";
import { AppTopBar } from "./AppTopBar";
import { Container } from "./Container";

export function AppShell(props: {
  title: ReactNode;
  subtitle?: ReactNode;
  breadcrumb?: ReactNode;
  right?: ReactNode;
  children: ReactNode;
}) {
  const theme = useThemeStore((s) => s.theme);
  const locale = useLocaleStore((s) => s.locale);
  const { t } = useTranslation();

  usePomodoroTimer();

  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  useEffect(() => {
    applyLocaleToDocument(locale);
    void syncLocaleToCursorConfig(locale);
  }, [locale]);

  return (
    <div className="flex h-dvh flex-col overflow-hidden text-text0" data-theme={theme}>
      <AppTopBar />
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-14 focus:z-50 focus:rounded-panel focus:bg-surfaceControl focus:px-3 focus:py-2"
      >
        {t("nav.skipToContent")}
      </a>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto overscroll-y-contain py-6 sm:py-10">
        <Container className="flex min-h-full flex-col">
          <header className="mb-5 flex shrink-0 flex-col gap-3 sm:mb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-title font-semibold tracking-[-0.01em]">{props.title}</h1>
              {props.breadcrumb ? <div className="mt-2">{props.breadcrumb}</div> : null}
              {props.subtitle ? <p className="mt-1 text-meta text-text1">{props.subtitle}</p> : null}
            </div>
            {props.right ? <div className="shrink-0">{props.right}</div> : null}
          </header>

          <main id="main-content" className="flex min-h-0 flex-1 flex-col">
            {props.children}
          </main>
        </Container>
      </div>
    </div>
  );
}
