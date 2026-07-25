import { BookOpenText, Map } from "lucide-react";
import type { ReactNode } from "react";
import { useTranslation } from "../../../application/hooks/useTranslation";
import { Icon, Tabs } from "../../design-system";

export type CatalogTab = "courses" | "content-map";

export function parseCatalogTab(raw: string | null): CatalogTab {
  return raw === "content-map" ? "content-map" : "courses";
}

export function CatalogTabBar(props: {
  value: CatalogTab;
  onValueChange: (tab: CatalogTab) => void;
  trailing?: ReactNode;
}) {
  const { t } = useTranslation();
  const tabItems = [
    { value: "courses" as const, label: t("catalog.tabCourses"), icon: <Icon icon={BookOpenText} /> },
    { value: "content-map" as const, label: t("catalog.tabContentMap"), icon: <Icon icon={Map} /> },
  ];

  return (
    <div
      className="flex shrink-0 flex-col gap-3 lg:flex-row lg:items-center lg:justify-between"
      data-tour="catalog-tabs"
    >
      <Tabs
        items={tabItems}
        value={props.value}
        onValueChange={(value) => props.onValueChange(value as CatalogTab)}
        listClassName="max-w-full"
      />
      {props.trailing ? (
        <div className="flex min-w-0 flex-wrap items-center gap-3 lg:justify-end">
          {props.trailing}
        </div>
      ) : null}
    </div>
  );
}
