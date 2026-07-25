import clsx from "clsx";
import { Languages, Menu, Moon, Sun, Timer } from "lucide-react";
import { useState } from "react";
import type { AppLocale } from "../../../domain/types/locale";
import { SUPPORTED_LOCALES } from "../../../domain/types/locale";
import type { AppTheme } from "../../../domain/types/theme";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { primePomodoroAudio } from "../../../application/hooks/usePomodoroTimer";
import { playPomodoroNotification } from "../../../application/usecases/pomodoroSound";
import {
  formatPomodoroTime,
  usePomodoroStore,
} from "../../../application/stores/pomodoroStore";
import { useThemeStore } from "../../../application/stores/themeStore";
import { Button, Icon, Popover } from "../../design-system";

const LOCALE_OPTION_KEYS: Record<AppLocale, "locale.en" | "locale.pt" | "locale.es" | "locale.zh"> =
  {
    en: "locale.en",
    pt: "locale.pt",
    es: "locale.es",
    zh: "locale.zh",
  };

const THEME_OPTIONS: { value: AppTheme; labelKey: "theme.light" | "theme.dark"; icon: typeof Sun }[] =
  [
    { value: "light", labelKey: "theme.light", icon: Sun },
    { value: "dark", labelKey: "theme.dark", icon: Moon },
  ];

export function HeaderOverflowMenu(props: { showPomodoro?: boolean }) {
  const { locale, setLocale, t } = useTranslation();
  const [open, setOpen] = useState(false);
  const showPomodoro = props.showPomodoro !== false;
  const theme = useThemeStore((s) => s.theme);
  const setTheme = useThemeStore((s) => s.setTheme);
  const pomodoroStatus = usePomodoroStore((s) => s.status);
  const remainingSeconds = usePomodoroStore((s) => s.remainingSeconds);
  const durationSeconds = usePomodoroStore((s) => s.durationSeconds);
  const startPomodoro = usePomodoroStore((s) => s.start);
  const resetPomodoro = usePomodoroStore((s) => s.reset);

  const pomodoroStatusLabel =
    pomodoroStatus === "idle"
      ? t("pomodoro.status.idle")
      : pomodoroStatus === "running"
        ? t("pomodoro.status.running")
        : t("pomodoro.status.finished");

  return (
    <Popover
      align="end"
      open={open}
      onOpenChange={setOpen}
      panelClassName="w-[min(100vw-2rem,16rem)] p-2"
      trigger={({ open: isOpen, toggle, triggerId, panelId }) => (
        <button
          id={triggerId}
          type="button"
          data-tour="header-overflow"
          aria-expanded={isOpen}
          aria-controls={panelId}
          aria-haspopup="menu"
          aria-label={t("nav.moreOptions")}
          onClick={toggle}
          className={clsx(
            "inline-flex min-h-11 min-w-11 items-center justify-center rounded-panel border border-border0 bg-surfacePanel text-text0 transition",
            "hover:bg-surfaceControl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent0/60",
            isOpen && "border-accent0/40 bg-surfaceControl",
          )}
        >
          <Icon icon={Menu} size={18} aria-hidden />
        </button>
      )}
    >
      <div className="flex flex-col gap-3" role="menu" aria-label={t("nav.moreOptions")}>
        <div className="grid gap-1">
          <div className="flex items-center gap-1.5 px-1 text-meta font-medium text-text1">
            <Icon icon={Languages} size={14} aria-hidden />
            <span>{t("locale.label")}</span>
          </div>
          <div className="grid gap-0.5" role="listbox" aria-label={t("locale.label")}>
            {SUPPORTED_LOCALES.map((value) => (
              <Button
                key={value}
                type="button"
                size="sm"
                variant={locale === value ? "primary" : "ghost"}
                className={clsx("w-full justify-start", locale !== value && "text-text1")}
                role="option"
                aria-selected={locale === value}
                onClick={() => {
                  if (value !== locale) setLocale(value);
                }}
              >
                {t(LOCALE_OPTION_KEYS[value])}
              </Button>
            ))}
          </div>
        </div>

        {showPomodoro ? (
          <div className="grid gap-1.5 border-t border-border0 pt-3">
            <div className="flex items-center gap-1.5 px-1 text-meta font-medium text-text1">
              <Icon icon={Timer} size={14} aria-hidden />
              <span>{t("pomodoro.label")}</span>
            </div>
            <p className="m-0 px-1 text-meta text-text1">
              {pomodoroStatus !== "idle"
                ? `${formatPomodoroTime(remainingSeconds)} · ${pomodoroStatusLabel}`
                : `${formatPomodoroTime(durationSeconds)} · ${pomodoroStatusLabel}`}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {pomodoroStatus === "idle" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    void primePomodoroAudio();
                    startPomodoro();
                  }}
                >
                  {t("pomodoro.start")}
                </Button>
              ) : null}
              {pomodoroStatus === "finished" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="primary"
                  className="flex-1"
                  onClick={() => {
                    void primePomodoroAudio();
                    resetPomodoro();
                    startPomodoro();
                  }}
                >
                  {t("pomodoro.startAgain")}
                </Button>
              ) : null}
              {pomodoroStatus !== "idle" ? (
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    resetPomodoro();
                    void playPomodoroNotification("reset");
                  }}
                >
                  {t("pomodoro.reset")}
                </Button>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="grid gap-1.5 border-t border-border0 pt-3">
          <p className="m-0 px-1 text-meta font-medium text-text1">{t("theme.label")}</p>
          <div
            className="inline-flex w-full rounded-panel border border-border0 bg-surfacePanel p-0.5"
            role="group"
            aria-label={t("theme.label")}
          >
            {THEME_OPTIONS.map((option) => (
              <Button
                key={option.value}
                type="button"
                size="sm"
                variant={theme === option.value ? "primary" : "ghost"}
                className={clsx("h-9 min-w-0 flex-1 px-0", theme !== option.value && "text-text1")}
                aria-label={t(option.labelKey)}
                title={t(option.labelKey)}
                aria-pressed={theme === option.value}
                onClick={() => setTheme(option.value)}
              >
                <Icon icon={option.icon} size={16} />
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Popover>
  );
}
