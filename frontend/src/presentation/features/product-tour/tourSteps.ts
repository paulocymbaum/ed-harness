import type { TranslationKey } from "../../../infrastructure/i18n/locales/en";

export type ProductTourStep = {
  id: string;
  target: string;
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
};

/** Catalog-home guided tour for visitors arriving from the landing page. */
export const PRODUCT_TOUR_STEPS: ProductTourStep[] = [
  {
    id: "welcome",
    target: '[data-tour="topbar"]',
    titleKey: "tour.welcome.title",
    bodyKey: "tour.welcome.body",
  },
  {
    id: "locale",
    target: '[data-tour="locale"]',
    titleKey: "tour.locale.title",
    bodyKey: "tour.locale.body",
  },
  {
    id: "focus",
    target: '[data-tour="pomodoro"]',
    titleKey: "tour.pomodoro.title",
    bodyKey: "tour.pomodoro.body",
  },
  {
    id: "theme",
    target: '[data-tour="theme"]',
    titleKey: "tour.theme.title",
    bodyKey: "tour.theme.body",
  },
  {
    id: "tabs",
    target: '[data-tour="catalog-tabs"]',
    titleKey: "tour.tabs.title",
    bodyKey: "tour.tabs.body",
  },
  {
    id: "dashboard",
    target: '[data-tour="dashboard"]',
    titleKey: "tour.dashboard.title",
    bodyKey: "tour.dashboard.body",
  },
  {
    id: "courses",
    target: '[data-tour="course-list"]',
    titleKey: "tour.courses.title",
    bodyKey: "tour.courses.body",
  },
];
