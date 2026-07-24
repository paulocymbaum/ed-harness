import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  detectBrowserLocale,
  type AppLocale,
} from "../../domain/types/locale";
import { syncLocaleToCursorConfig } from "../../infrastructure/i18n/syncLocaleToCursorConfig";

type LocaleState = {
  locale: AppLocale;
  setLocale: (locale: AppLocale) => void;
};

export const useLocaleStore = create<LocaleState>()(
  persist(
    (set, get) => ({
      locale: detectBrowserLocale(),
      setLocale: (locale) => {
        if (get().locale !== locale) set({ locale });
        // Sync only on explicit selection (picker / ?lang=), never on mount
        // or persist rehydration. The Vite API skips the write when unchanged.
        void syncLocaleToCursorConfig(locale);
      },
    }),
    { name: "ed-harness-locale" },
  ),
);
