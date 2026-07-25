import type { ReactNode } from "react";
import { BrandMark } from "./BrandMark";
import { Container } from "./Container";
import { HeaderOverflowMenu } from "./HeaderOverflowMenu";
import { LanguageSelector } from "./LanguageSelector";
import { PomodoroHeaderControl } from "./PomodoroHeaderControl";
import { ThemeToggle } from "./ThemeToggle";

export function AppTopBar(props: {
  showPomodoro?: boolean;
  center?: ReactNode;
}) {
  const showPomodoro = props.showPomodoro !== false;

  return (
    <div
      className="relative z-50 shrink-0 overflow-visible border-b border-border0 bg-glassFillStrong backdrop-blur-[var(--blur-2)]"
      data-tour="topbar"
    >
      <Container className="flex min-h-12 items-center gap-3 overflow-visible py-1.5">
        <BrandMark />
        <div className="flex min-w-0 flex-1 items-center justify-center px-1">
          {props.center}
        </div>
        <div className="flex shrink-0 items-center gap-2">
          <div className="hidden items-center gap-2 sm:flex">
            <LanguageSelector />
            {showPomodoro ? <PomodoroHeaderControl /> : null}
            <ThemeToggle />
          </div>
          <div className="sm:hidden">
            <HeaderOverflowMenu showPomodoro={showPomodoro} />
          </div>
        </div>
      </Container>
    </div>
  );
}
