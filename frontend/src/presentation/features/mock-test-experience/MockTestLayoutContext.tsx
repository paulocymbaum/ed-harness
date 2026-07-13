import { createContext, useContext } from "react";
import type { Course } from "../../../domain/types/catalog";
import type { MockTestModule } from "../../../domain/types/mockTest";

export type MockTestLayoutContextValue = {
  courseId: string;
  moduleId: string;
  course: Course;
  mockTest: MockTestModule;
};

const MockTestLayoutContext = createContext<MockTestLayoutContextValue | null>(null);

export function MockTestLayoutProvider(props: {
  value: MockTestLayoutContextValue;
  children: React.ReactNode;
}) {
  return (
    <MockTestLayoutContext.Provider value={props.value}>
      {props.children}
    </MockTestLayoutContext.Provider>
  );
}

export function useMockTestLayoutContext(): MockTestLayoutContextValue {
  const ctx = useContext(MockTestLayoutContext);
  if (!ctx) throw new Error("useMockTestLayoutContext requires MockTestLayoutProvider");
  return ctx;
}
