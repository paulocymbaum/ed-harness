import { useLayoutEffect } from "react";
import type { Course } from "../../../../domain/types/catalog";
import type { Quiz } from "../../../../domain/types/quiz";
import { useCoursePoints } from "../../../../application/hooks/useCoursePoints";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { useQuizSessionStore } from "../../../../application/stores/quizSessionStore";
import { ReadmePanel } from "../../../shared/ReadmePanel";
import { LayoutFocoAtividade } from "../../lesson-workspace/components/LayoutFocoAtividade";
import { QuizProgressBar } from "./QuizProgressBar";
import { QuizQuestionView } from "./QuizQuestionView";
import { QuizResultsPanel } from "./QuizResultsPanel";
import { QuizSessionControls } from "./QuizSessionControls";

export function QuizSessaoFoco(props: {
  courseId: string;
  course: Course;
  quiz: Quiz;
  lessonMarkdown: string;
  lessonTitle: string;
  onVoltar: () => void;
}) {
  const { t } = useTranslation();

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

  if (isComplete && lastAttempt) {
    return (
      <section className="rounded-panel border border-border0 bg-surfacePanel p-4">
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
          onBackToList={props.onVoltar}
          backLabelKey="foco.voltarLicao"
        />
      </section>
    );
  }

  const perguntasDaSessao = perguntasEmbaralhadas ?? props.quiz.questions;
  const total = perguntasDaSessao.length;
  const question = perguntasDaSessao[currentIndex];
  if (!question) return null;

  const isChecked = Boolean(checkedQuestions[question.id]);
  const hasAnswer = Boolean(answers[question.id]);
  const isLast = currentIndex >= total - 1;

  const painelEsquerdo = (
    <ReadmePanel
      title={props.lessonTitle}
      markdown={props.lessonMarkdown}
      showTitle
      variant="inline"
    />
  );

  const painelDireito = (
    <div className="mx-auto grid w-full max-w-[720px] gap-4">
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
    </div>
  );

  return (
    <LayoutFocoAtividade
      titulo={props.quiz.title}
      onVoltar={props.onVoltar}
      chaveDivisor="edharness.foco.split.quiz"
      proporcaoInicial={0.4}
      rotuloEsquerdo={t("tabs.explanation")}
      rotuloDireito={t("quiz.title")}
      painelEsquerdo={painelEsquerdo}
      painelDireito={painelDireito}
    />
  );
}
