import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { CatalogRoute } from "../features/catalog/CatalogRoute";
import { CourseExperienceRoute } from "../features/course-experience/CourseExperienceRoute";
import { ModuleLayoutRoute } from "../features/module-experience/ModuleLayoutRoute";
import { ModuleExperienceRoute } from "../features/module-experience/ModuleExperienceRoute";
import { LessonWorkspaceRoute } from "../features/lesson-workspace/LessonWorkspaceRoute";
import {
  MockTestExperienceRoute,
  MockTestOverviewRoute,
  MockTestSectionRoute,
} from "../features/mock-test-experience";

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<CatalogRoute />} />
        <Route path="/course/:courseId" element={<CourseExperienceRoute />} />
        <Route path="/course/:courseId/module/:moduleId" element={<ModuleLayoutRoute />}>
          <Route index element={<ModuleExperienceRoute />} />
          <Route path="lesson/:lessonId" element={<LessonWorkspaceRoute />} />
          <Route path="mock-test" element={<MockTestExperienceRoute />}>
            <Route index element={<MockTestOverviewRoute />} />
            <Route path="section/:sectionId" element={<MockTestSectionRoute />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
