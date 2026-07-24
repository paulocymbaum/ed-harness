/** Paths canônicos da experiência hierárquica (lição, quiz e projeto). */

export function caminhoLicao(courseId: string, moduleId: string, lessonId: string): string {
  return `/course/${encodeURIComponent(courseId)}/module/${encodeURIComponent(moduleId)}/lesson/${encodeURIComponent(lessonId)}`;
}

export function caminhoQuizLicao(
  courseId: string,
  moduleId: string,
  lessonId: string,
  quizId: string,
): string {
  return `${caminhoLicao(courseId, moduleId, lessonId)}/quiz/${encodeURIComponent(quizId)}`;
}

export function caminhoProjetoLicao(
  courseId: string,
  moduleId: string,
  lessonId: string,
  projectId: string,
): string {
  return `${caminhoLicao(courseId, moduleId, lessonId)}/project/${encodeURIComponent(projectId)}`;
}
