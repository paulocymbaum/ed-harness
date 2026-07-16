import type { ReactNode } from "react";

export function Container(props: {
  children: ReactNode;
  className?: string;
  /** Full-bleed workspace without the catalog max-width. */
  variant?: "default" | "foco";
}) {
  const isFoco = props.variant === "foco";

  return (
    <div
      className={[
        "mx-auto w-full",
        isFoco
          ? "max-w-none px-3 sm:px-4 lg:px-5"
          : "max-w-[1280px] 2xl:max-w-[1536px] px-4 sm:px-6 lg:px-8",
        props.className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {props.children}
    </div>
  );
}
