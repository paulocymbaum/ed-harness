import { useState } from "react";
import type { ReaderEntry } from "../../../../domain/types/reader";
import { useProjectDelivery } from "../../../../application/hooks/useProjectDelivery";
import { useTranslation } from "../../../../application/hooks/useTranslation";
import { useToastStore } from "../../../../application/stores/toastStore";
import {
  appendStarterToDraft,
  hasProjectStarter,
} from "../../../../application/usecases/importProjectStarter";
import { canRunProjectDraft } from "../../../../application/usecases/extractStarterIndexFromDraft";
import { useProjectRun } from "../../../../application/hooks/useProjectRun";
import { getProjectTestCases, hasProjectTestCases } from "../../../../application/usecases/projectTestCases";
import { Button, Dialog, EmptyState, ErrorPanel, LoadingState } from "../../../design-system";
import { DeliveryDraftEditor } from "./DeliveryDraftEditor";
import { DeliveryPromptToolbar } from "./DeliveryPromptToolbar";
import { DeliveryHistoryList } from "./DeliveryHistoryList";
import { ProjectRunAnswerPanel } from "./ProjectRunAnswerPanel";

function humanizeSlug(slug: string): string {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .filter(Boolean)
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function parseProjectPath(rootPath: string) {
  const parts = rootPath.split("/").filter(Boolean);
  const projectsIdx = parts.indexOf("projects");
  const lessonSlug =
    projectsIdx > 0 ? (parts[projectsIdx - 1] ?? "") : (parts[parts.length - 2] ?? "");
  const projectSlug = parts[parts.length - 1] ?? "";
  return {
    topicSlug: lessonSlug,
    topicTitle: humanizeSlug(lessonSlug),
    projectSlug,
  };
}

export function ProjectDeliveryPanel(props: {
  courseId: string;
  courseTitle: string;
  projectTitle: string;
  projectId: string;
  rootPath: string;
  entries?: ReaderEntry[];
  enabled: boolean;
}) {
  const { courseId, courseTitle, projectTitle, projectId, rootPath, entries = [], enabled } = props;
  const { t } = useTranslation();
  const showToast = useToastStore((s) => s.show);
  const { topicTitle } = parseProjectPath(rootPath);
  const { draft, setDraft, deliveries, loading, error, saving, save, canSave } =
    useProjectDelivery({ courseId, projectId, rootPath, enabled });

  const [pasteConfirmOpen, setPasteConfirmOpen] = useState(false);
  const latestDelivery = deliveries.at(-1);
  const canPasteLatest = deliveries.length > 0;

  const handleSave = async () => {
    const ok = await save();
    if (ok) {
      showToast(t("toast.deliverySaved"), "success");
    } else {
      showToast(t("toast.deliverySaveFailed"), "error");
    }
  };

  const canImportStarter = hasProjectStarter(entries);
  const showRunAnswer = hasProjectStarter(entries);
  const projectTestCases = getProjectTestCases(entries);
  const starterEntry = entries.find(
    (entry) => entry.kind === "file" && entry.path === "starter/index.js",
  );
  const starterCode = starterEntry?.content ?? null;
  const canRunAnswer =
    hasProjectTestCases(entries) && canRunProjectDraft(draft, hasProjectStarter(entries));
  const { running, matrix, error: runError, run } = useProjectRun({
    courseId,
    rootPath,
    draft,
    enabled: enabled && canRunAnswer,
    testCases: projectTestCases,
    starterCode,
  });

  const promptContext = {
    courseId,
    courseTitle,
    projectTitle,
    projectId,
    rootPath,
    topicTitle,
  };

  if (loading) {
    return (
      <div className="p-4">
        <LoadingState message={t("delivery.loading")} />
      </div>
    );
  }

  const handlePasteLatest = () => {
    if (!latestDelivery) return;
    setDraft(latestDelivery.content);
    setPasteConfirmOpen(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div>
          <label htmlFor="project-delivery-draft" className="mb-2 block text-body font-medium text-text0">
            {t("delivery.writeHeading")}
          </label>
          <p className="mb-3 text-meta text-text1">{t("delivery.writeHint")}</p>
          <div className="mb-3">
            <DeliveryPromptToolbar {...promptContext} />
          </div>
          <DeliveryDraftEditor
            id="project-delivery-draft"
            rows={12}
            value={draft}
            onChange={setDraft}
            placeholder={t("delivery.placeholder")}
          />
          {showRunAnswer ? (
            <ProjectRunAnswerPanel
              canRun={canRunAnswer}
              running={running}
              matrix={matrix}
              testCases={projectTestCases}
              error={runError}
              onRun={() => void run()}
            />
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button type="button" variant="primary" disabled={!canSave} onClick={() => void handleSave()}>
            {saving ? t("reader.saving") : t("reader.saveDelivery")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!canImportStarter}
            title={
              canImportStarter ? t("delivery.importStarterTooltip") : t("delivery.noStarter")
            }
            onClick={() => setDraft((current) => appendStarterToDraft(current, entries))}
          >
            {t("delivery.importStarter")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            disabled={!canPasteLatest}
            title={
              canPasteLatest ? t("delivery.pasteLatestTooltip") : t("delivery.noDeliveriesToPaste")
            }
            onClick={() => setPasteConfirmOpen(true)}
          >
            {t("delivery.pasteLatest")}
          </Button>
          {error ? <p className="text-meta text-text1">{error}</p> : null}
        </div>

        <Dialog
          open={pasteConfirmOpen}
          onOpenChange={setPasteConfirmOpen}
          title={t("delivery.pasteLatestConfirmTitle")}
          description={t("delivery.pasteLatestConfirmDescription")}
          className="max-w-md"
          header={
            <div className="border-b border-border0 px-4 py-4">
              <h2 className="text-body font-semibold text-text0">
                {t("delivery.pasteLatestConfirmTitle")}
              </h2>
              <p className="mt-2 text-meta text-text1">
                {t("delivery.pasteLatestConfirmDescription")}
              </p>
            </div>
          }
        >
          <div className="flex justify-end gap-2 px-4 py-4">
            <Button type="button" variant="ghost" onClick={() => setPasteConfirmOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="button" variant="primary" onClick={handlePasteLatest}>
              {t("delivery.pasteLatestConfirmAction")}
            </Button>
          </div>
        </Dialog>

        {error && error !== "Saved locally; dev server unavailable for disk sync" ? (
          <ErrorPanel title={t("reader.loadDeliveriesError")} message={error} />
        ) : null}

        {deliveries.length === 0 ? (
          <EmptyState
            title={t("delivery.emptyTitle")}
            description={t("delivery.emptyDescription")}
          />
        ) : (
          <DeliveryHistoryList deliveries={deliveries} />
        )}
      </div>
    </div>
  );
}
