import clsx from "clsx";
import { CheckCircle2, Circle } from "lucide-react";
import { useLocation } from "react-router-dom";
import type { MockTestModule } from "../../../../domain/types/mockTest";
import { useAppNavigation } from "../../../../application/hooks/useAppNavigation";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { useMockTestFinalScore } from "../../../../application/hooks/useMockTestFinalScore";
import { sectionTypeLabelKey } from "../../../../application/selectors/mockTestSelectors";
import { Icon } from "../../../design-system";
import { MockTestFinalScoreBar } from "./MockTestFinalScoreBar";

export function MockTestSectionNav(props: {
  courseId: string;
  mockTest: MockTestModule;
}) {
  const { t } = useTranslation();
  const location = useLocation();
  const { goMockTestSection } = useAppNavigation();

  const activeSectionId = location.pathname.match(/\/section\/([^/]+)/)?.[1] ?? null;
  const finalScore = useMockTestFinalScore(props.courseId, props.mockTest);

  return (
    <nav aria-label={t("mockTest.sectionsNav")} className="flex flex-col gap-1 p-3">
      <p className="m-0 px-2 py-1 text-meta font-semibold uppercase tracking-wide text-text1">
        {t("mockTest.sections")}
      </p>

      {finalScore ? (
        <MockTestFinalScoreBar
          className="mb-2 px-2"
          compact
          percent={finalScore.percent}
          passed={finalScore.passed}
          passingScorePercent={props.mockTest.mockTest.passingScorePercent}
        />
      ) : null}

      {props.mockTest.mockTest.sections.map((section, index) => {
        const lesson = props.mockTest.lessons.find((l) => l.id === section.lessonId);
        const isActive = activeSectionId === section.lessonId;
        const label = lesson?.title ?? t(sectionTypeLabelKey(section.type));

        return (
          <button
            key={section.lessonId}
            type="button"
            className={clsx(
              "flex w-full items-center gap-3 rounded-panel px-3 py-2 text-left text-body transition",
              isActive
                ? "bg-surfaceAccent text-text0"
                : "text-text1 hover:bg-surfacePanel/80 hover:text-text0",
            )}
            onClick={() => goMockTestSection(props.courseId, props.mockTest.id, section.lessonId)}
          >
            <Icon
              icon={isActive ? CheckCircle2 : Circle}
              size={16}
              className={isActive ? "text-accent0" : "text-text1"}
            />
            <span className="min-w-0 flex-1">
              <span className="block font-mono text-meta text-accent0">{index + 1}</span>
              <span className="block truncate font-medium">{label}</span>
              <span className="block text-meta text-text1">
                {t(sectionTypeLabelKey(section.type))}
              </span>
            </span>
          </button>
        );
      })}
    </nav>
  );
}
