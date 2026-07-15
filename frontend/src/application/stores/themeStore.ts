import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AppTheme } from "../../domain/types/theme";

type ThemeState = {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  toggleTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        set({ theme: get().theme === "dark" ? "light" : "dark" });
      },
    }),
    { name: "ed-harness-theme" },
  ),
);

export function applyThemeToDocument(theme: AppTheme): void {
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
}

export function readPersistedTheme(): AppTheme | null {
  try {
    const raw = localStorage.getItem("ed-harness-theme");
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { state?: { theme?: unknown } };
    const theme = parsed?.state?.theme;
    return theme === "light" || theme === "dark" ? theme : null;
  } catch {
    return null;
  }
}
