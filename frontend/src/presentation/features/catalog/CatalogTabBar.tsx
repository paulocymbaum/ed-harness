import { BookOpenText, Map } from "lucide-react";
import type { ReactNode } from "react";
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
  const tabItems = [
    { value: "courses" as const, label: "Courses", icon: <Icon icon={BookOpenText} /> },
    { value: "content-map" as const, label: "Content Map", icon: <Icon icon={Map} /> },
  ];

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Tabs
        items={tabItems}
        value={props.value}
        onValueChange={(value) => props.onValueChange(value as CatalogTab)}
        listClassName="max-w-full"
      />
      {props.trailing ? (
        <div className="flex flex-wrap items-center gap-3 sm:justify-end">{props.trailing}</div>
      ) : null}
    </div>
  );
}
