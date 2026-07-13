import { useState } from "react";
import type { Course, Project } from "../../../../domain/types/catalog";
import type { DrawerTab } from "../../../../domain/types/navigation";
import { ProjectReader } from "../../content-reader/ProjectReader";

export function MockTestCodingSection(props: {
  courseId: string;
  course: Course;
  project: Project;
}) {
  const [drawerTab, setDrawerTab] = useState<DrawerTab>("delivery");

  return (
    <div className="flex h-full min-h-[60vh] flex-col">
      <ProjectReader
        layout="drawer"
        courseId={props.courseId}
        courseTitle={props.course.title}
        project={props.project}
        drawerTab={drawerTab}
        onDrawerTabChange={setDrawerTab}
        embedded
      />
    </div>
  );
}
