import type { MockTestModule } from "../../../../domain/types/mockTest";
import { useMockTestFinalScore } from "../../../../application/hooks/useMockTestFinalScore";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { useAppNavigation } from "../../../../application/hooks/useAppNavigation";
import { Card, Icon } from "../../../design-system";
import { MockTestFinalScoreBar } from "../../mock-test-experience/components/MockTestFinalScoreBar";
import { ChevronRight, Timer } from "lucide-react";

function MockTestCard(props: { courseId: string; mockTest: MockTestModule }) {
  const { goMockTest } = useAppNavigation();
  const { t } = useTranslation();
  const finalScore = useMockTestFinalScore(props.courseId, props.mockTest);
  const moduleIndex = props.mockTest.graphIndex ?? props.mockTest.id.match(/^(\d+)/)?.[1] ?? "";
  const { durationMinutes, passingScorePercent } = props.mockTest.mockTest;

  return (
    <Card variant="panel" className="overflow-hidden p-0">
      <button
        type="button"
        className="flex w-full items-start gap-4 p-4 text-left transition hover:bg-surfacePanel/60"
        onClick={() => goMockTest(props.courseId, props.mockTest.id)}
      >
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-panel border border-accent0/25 bg-surfaceAccent text-accent0"
          aria-hidden
        >
          <Icon icon={Timer} size={20} />
        </span>

        <span className="min-w-0 flex-1">
          <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
            {moduleIndex ? (
              <span className="rounded-pill border border-border0 bg-surfaceControl px-2 py-0.5 font-mono text-meta font-semibold text-accent0">
                {moduleIndex}
              </span>
            ) : null}
            <span className="text-body font-semibold text-text0">{props.mockTest.title}</span>
          </span>
          <span className="mt-2 block text-meta text-text1">
            {t("course.mockTestMeta", {
              minutes: durationMinutes,
              percent: passingScorePercent,
              sections: props.mockTest.mockTest.sections.length,
            })}
          </span>
          {finalScore ? (
            <MockTestFinalScoreBar
              className="mt-3"
              compact
              percent={finalScore.percent}
              passed={finalScore.passed}
              passingScorePercent={passingScorePercent}
            />
          ) : null}
        </span>

        <Icon icon={ChevronRight} size={18} className="mt-1 shrink-0 text-text1" />
      </button>
    </Card>
  );
}

export function MockTestList(props: {
  courseId: string;
  mockTests: MockTestModule[];
}) {
  const { t } = useTranslation();

  if (props.mockTests.length === 0) return null;

  return (
    <section className="grid gap-3">
      <h2 className="m-0 text-body font-semibold text-text0">{t("course.mockTestsHeading")}</h2>
      <div className="grid gap-4">
        {props.mockTests.map((mockTest) => (
          <MockTestCard key={mockTest.id} courseId={props.courseId} mockTest={mockTest} />
        ))}
      </div>
    </section>
  );
}
