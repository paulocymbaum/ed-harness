import type { ReactNode } from "react";

export function MarkdownCitacao(props: { children: ReactNode }) {
  return (
    <blockquote className="m-0 mb-4 border-l-[3px] border-border0 py-1 pl-4 text-text1">
      {props.children}
    </blockquote>
  );
}
