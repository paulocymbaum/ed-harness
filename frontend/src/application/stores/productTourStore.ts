import { create } from "zustand";

type ProductTourState = {
  active: boolean;
  stepIndex: number;
  start: () => void;
  next: (stepCount: number) => void;
  prev: () => void;
  skip: () => void;
};

export const useProductTourStore = create<ProductTourState>((set, get) => ({
  active: false,
  stepIndex: 0,
  start: () => set({ active: true, stepIndex: 0 }),
  next: (stepCount) => {
    const { stepIndex } = get();
    if (stepIndex >= stepCount - 1) {
      set({ active: false, stepIndex: 0 });
      return;
    }
    set({ stepIndex: stepIndex + 1 });
  },
  prev: () => {
    const { stepIndex } = get();
    set({ stepIndex: Math.max(0, stepIndex - 1) });
  },
  skip: () => set({ active: false, stepIndex: 0 }),
}));
