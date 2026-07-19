import { extractYoutubeVideoId, youtubeEmbedUrl } from "../../../../application/usecases/extractYoutubeVideoId";
import { useTranslation } from "../../../../application/hooks/useTranslation";

export function LessonVideoPlayer(props: { url: string; title: string }) {
  const { t } = useTranslation();
  const videoId = extractYoutubeVideoId(props.url);

  if (!videoId) {
    return (
      <p className="text-meta text-text1">
        {t("lesson.videoUnavailable")}{" "}
        <a
          href={props.url}
          target="_blank"
          rel="noreferrer"
          className="text-accent0 underline underline-offset-2"
        >
          {t("lesson.videoOpenExternal")}
        </a>
      </p>
    );
  }

  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-panel border border-border0 bg-black">
      <iframe
        title={props.title}
        src={youtubeEmbedUrl(videoId)}
        className="absolute inset-0 h-full w-full"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
