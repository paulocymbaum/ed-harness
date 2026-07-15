import type { MockTestModule } from "../../../../domain/types/mockTest";
import { useMockTestFinalScore } from "../../../../application/hooks/useMockTestFinalScore";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { sectionTypeLabelKey } from "../../../../application/selectors/mockTestSelectors";
import { Card, Icon } from "../../../design-system";
import { MockTestFinalScoreBar } from "./MockTestFinalScoreBar";
import { Clock, Target } from "lucide-react";

export function MockTestHeader(props: { courseId: string; mockTest: MockTestModule }) {
  const { t } = useTranslation();
  const { mockTest: meta } = props.mockTest;
  const finalScore = useMockTestFinalScore(props.courseId, props.mockTest);

  return (
    <Card variant="panel" className="p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="grid gap-1">
          <h1 className="m-0 text-h2 font-semibold text-text0">{props.mockTest.title}</h1>
          <p className="m-0 text-meta text-text1">{t("mockTest.subtitle")}</p>
        </div>

        <dl className="m-0 flex flex-wrap gap-4 text-meta text-text1">
          <div className="flex items-center gap-2">
            <Icon icon={Clock} size={16} className="text-accent0" />
            <span>
              {t("mockTest.duration", { minutes: meta.durationMinutes })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Icon icon={Target} size={16} className="text-accent0" />
            <span>
              {t("mockTest.passingScore", { percent: meta.passingScorePercent })}
            </span>
          </div>
        </dl>
      </div>

      <ol className="mb-0 mt-4 grid gap-2 pl-5 text-body text-text1">
        {meta.sections.map((section, index) => (
          <li key={section.lessonId}>
            <span className="font-mono text-meta text-accent0">{index + 1}.</span>{" "}
            {t(sectionTypeLabelKey(section.type))}
          </li>
        ))}
      </ol>

      {finalScore ? (
        <div className="mt-4 border-t border-border0 pt-4">
          <MockTestFinalScoreBar
            percent={finalScore.percent}
            passed={finalScore.passed}
            passingScorePercent={meta.passingScorePercent}
          />
        </div>
      ) : null}
    </Card>
  );
}
