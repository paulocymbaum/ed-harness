import { Link } from "react-router-dom";
import type { AppTheme } from "../../../domain/types/theme";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { useThemeStore } from "../../../application/stores/themeStore";
import { brandMarkSrc } from "../../../infrastructure/brand/brandAssets";

export function BrandMark() {
  const { t } = useTranslation();
  const theme = useThemeStore((s) => s.theme);

  return (
    <Link
      to="/"
      className="flex min-w-0 items-center gap-2 rounded-control outline-none focus-visible:ring-2 focus-visible:ring-accent0"
      aria-label={t("app.title")}
    >
      <BrandMarkImage theme={theme} />
      <span className="truncate text-meta font-semibold tracking-[-0.01em] text-text0">
        {t("app.title")}
      </span>
    </Link>
  );
}

function BrandMarkImage(props: { theme: AppTheme }) {
  return (
    <img
      src={brandMarkSrc(props.theme, 64)}
      alt=""
      width={28}
      height={28}
      className="size-7 shrink-0 object-contain"
      decoding="async"
    />
  );
}
