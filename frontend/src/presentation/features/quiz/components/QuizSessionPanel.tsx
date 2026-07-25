import { useLayoutEffect } from "react";
import { ArrowLeft } from "lucide-react";
import type { Quiz } from "../../../../domain/types/quiz";
import type { Course } from "../../../../domain/types/catalog";
import type { TranslationKey } from "../../../../infrastructure/i18n/locales/en";
import { useCoursePoints } from "../../../../application/hooks/useCoursePoints";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { useQuizSessionStore } from "../../../../application/stores/quizSessionStore";
import { Button, Icon } from "../../../design-system";
import { QuizProgressBar } from "./QuizProgressBar";
import { QuizQuestionView } from "./QuizQuestionView";
import { QuizResultsPanel } from "./QuizResultsPanel";
import { QuizSessionControls } from "./QuizSessionControls";

export function QuizSessionPanel(props: {
  courseId: string;
  course: Course;
  quiz: Quiz;
  onBackToList: () => void;
  compact?: boolean;
  backLabelKey?: TranslationKey;
}) {
  const { t } = useTranslation();
  const backLabelKey = props.backLabelKey ?? "quiz.backToQuizzes";
  const currentIndex = useQuizSessionStore((s) => s.currentIndex);
  const answers = useQuizSessionStore((s) => s.answers);
  const checkedQuestions = useQuizSessionStore((s) => s.checkedQuestions);
  const isComplete = useQuizSessionStore((s) => s.isComplete);
  const lastAttempt = useQuizSessionStore((s) => s.lastAttempt);
  const lastQuizPointsDelta = useQuizSessionStore((s) => s.lastQuizPointsDelta);
  const coursePoints = useCoursePoints(props.courseId, props.course);
  const selectAnswer = useQuizSessionStore((s) => s.selectAnswer);
  const checkCurrent = useQuizSessionStore((s) => s.checkCurrent);
  const goNext = useQuizSessionStore((s) => s.goNext);
  const goPrev = useQuizSessionStore((s) => s.goPrev);
  const finish = useQuizSessionStore((s) => s.finish);
  const sessionLessonId = useQuizSessionStore((s) => s.lessonId);
  const sessionQuizId = useQuizSessionStore((s) => s.quizId);
  const perguntasEmbaralhadas = useQuizSessionStore((s) => s.perguntasEmbaralhadas);
  const start = useQuizSessionStore((s) => s.start);
  const garantirPerguntasEmbaralhadas = useQuizSessionStore((s) => s.garantirPerguntasEmbaralhadas);

  useLayoutEffect(() => {
    if (sessionQuizId !== props.quiz.id) return;
    garantirPerguntasEmbaralhadas(props.quiz.questions);
  }, [sessionQuizId, props.quiz.id, props.quiz.questions, garantirPerguntasEmbaralhadas]);

  const perguntasDaSessao = perguntasEmbaralhadas ?? props.quiz.questions;
  const total = perguntasDaSessao.length;
  const question = perguntasDaSessao[currentIndex];
  const isChecked = question ? Boolean(checkedQuestions[question.id]) : false;
  const hasAnswer = question ? Boolean(answers[question.id]) : false;
  const isLast = currentIndex >= total - 1;

  if (isComplete && lastAttempt) {
    return (
      <QuizResultsPanel
        attempt={lastAttempt}
        quizTitle={props.quiz.title}
        coursePoints={coursePoints}
        quizPointsDelta={lastQuizPointsDelta}
        onRetry={() =>
          start(
            props.quiz.id,
            props.quiz.lessonId ?? sessionLessonId ?? undefined,
            props.quiz.questions,
          )
        }
        onBackToList={props.onBackToList}
        backLabelKey={backLabelKey}
      />
    );
  }

  if (!question) return null;

  return (
    <section className={props.compact ? "grid gap-4 p-4" : "grid gap-4"}>
      {!props.compact ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button variant="ghost" size="md" onClick={props.onBackToList}>
            <Icon icon={ArrowLeft} />
            {t(backLabelKey)}
          </Button>
          <div className="text-meta text-text1">{props.quiz.title}</div>
        </div>
      ) : (
        <div className="text-meta font-semibold text-text0">{props.quiz.title}</div>
      )}

      <QuizProgressBar current={currentIndex} total={total} />

      <QuizQuestionView
        question={question}
        questionNumber={currentIndex + 1}
        selectedOptionId={answers[question.id]}
        isChecked={isChecked}
        onSelect={(optionId) => selectAnswer(question.id, optionId)}
      />

      <QuizSessionControls
        currentIndex={currentIndex}
        isChecked={isChecked}
        hasAnswer={hasAnswer}
        isLast={isLast}
        onPrev={() => goPrev()}
        onCheck={() => checkCurrent(question.id)}
        onNext={() => goNext(total)}
        onFinish={() => finish(props.quiz, props.courseId)}
      />
    </section>
  );
}
