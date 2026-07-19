import type { LessonVideo } from "../../../../domain/types/catalog";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { Accordion } from "../../../design-system";
import { LessonVideoPlayer } from "./LessonVideoPlayer";

function formatViewCount(views: number, locale: string): string {
  const intlLocale =
    locale === "pt" ? "pt-BR" : locale === "zh" ? "zh-CN" : locale === "es" ? "es" : "en";
  try {
    return new Intl.NumberFormat(intlLocale, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(views);
  } catch {
    return String(views);
  }
}

export function LessonVideosAccordion(props: { videos: LessonVideo[] }) {
  const { t, locale } = useTranslation();
  const videos = props.videos.filter((v) => v.url && v.title);

  if (videos.length === 0) return null;

  return (
    <section className="mb-4 grid gap-2" aria-label={t("lesson.videos")}>
      {videos.map((video, index) => (
        <Accordion
          key={`${video.url}-${index}`}
          defaultOpen={index === 0}
          title={
            <div className="min-w-0">
              <p className="truncate text-body font-medium text-text0">{video.title}</p>
              <p className="truncate text-meta text-text1">
                {t("lesson.videoViews", { views: formatViewCount(video.views, locale) })}
              </p>
            </div>
          }
        >
          <LessonVideoPlayer url={video.url} title={video.title} />
        </Accordion>
      ))}
    </section>
  );
}
