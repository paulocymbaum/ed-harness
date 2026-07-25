export function classificarBlocoCodigo(className?: string): {
  isBlock: boolean;
  language: string | null;
} {
  if (!className) return { isBlock: false, language: null };
  const match = className.match(/language-([a-z0-9_+-]+)/i);
  if (!match) return { isBlock: false, language: null };
  return { isBlock: true, language: match[1]?.toLowerCase() ?? null };
}
