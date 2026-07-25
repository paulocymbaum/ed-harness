import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Button, Icon } from "../../../design-system";

export function QuizSessionControls(props: {
  currentIndex: number;
  isChecked: boolean;
  hasAnswer: boolean;
  isLast: boolean;
  onPrev: () => void;
  onCheck: () => void;
  onNext: () => void;
  onFinish: () => void;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <Button
        variant="secondary"
        size="md"
        onClick={props.onPrev}
        disabled={props.currentIndex === 0}
      >
        {t("quiz.previous")}
      </Button>

      <div className="flex flex-wrap gap-2">
        {!props.isChecked ? (
          <Button
            variant="primary"
            size="md"
            disabled={!props.hasAnswer}
            onClick={props.onCheck}
          >
            {t("quiz.checkAnswer")}
          </Button>
        ) : props.isLast ? (
          <Button variant="primary" size="md" onClick={props.onFinish}>
            <Icon icon={CheckCircle2} />
            {t("quiz.finish")}
          </Button>
        ) : (
          <Button variant="primary" size="md" onClick={props.onNext}>
            {t("quiz.next")}
          </Button>
        )}
      </div>
    </div>
  );
}
