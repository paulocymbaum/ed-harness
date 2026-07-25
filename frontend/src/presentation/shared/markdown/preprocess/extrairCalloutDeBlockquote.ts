import { Children, isValidElement, type ReactNode } from "react";
import type { MarkdownCalloutTipo } from "./normalizarAlertasMarkdown";
import { parseCalloutMarkerText } from "./normalizarAlertasMarkdown";

function nodeText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join("");
  if (isValidElement<{ children?: ReactNode }>(node)) {
    return nodeText(node.props.children);
  }
  return "";
}

function findCalloutInNode(node: ReactNode): MarkdownCalloutTipo | null {
  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return parseCalloutMarkerText(nodeText(node));
  }

  const typeName =
    typeof node.type === "string"
      ? node.type
      : typeof node.type === "function"
        ? (node.type as { displayName?: string; name?: string }).displayName ||
          (node.type as { name?: string }).name
        : "";

  if (typeName === "strong" || typeName === "b") {
    return parseCalloutMarkerText(nodeText(node.props.children));
  }

  return findCalloutInNode(node.props.children);
}

function stripLeadingCalloutMarker(node: ReactNode): ReactNode {
  if (!isValidElement<{ children?: ReactNode }>(node)) return node;

  const kids = Children.toArray(node.props.children);
  if (kids.length === 0) return null;

  if (findCalloutInNode(kids[0])) {
    const rest = kids.slice(1).filter((kid) => !(typeof kid === "string" && !kid.trim()));
    if (rest.length === 0) return null;
    return { ...node, props: { ...node.props, children: rest.length === 1 ? rest[0] : rest } };
  }

  return node;
}

/** Detects and strips a leading callout marker from blockquote children. */
export function extrairCalloutDeBlockquote(children: ReactNode): {
  tipo: MarkdownCalloutTipo | null;
  conteudo: ReactNode;
} {
  const list = Children.toArray(children);
  if (list.length === 0) return { tipo: null, conteudo: children };

  const tipo = findCalloutInNode(list[0]);
  if (!tipo) return { tipo: null, conteudo: children };

  const strippedFirst = stripLeadingCalloutMarker(list[0]);
  const conteudo = [strippedFirst, ...list.slice(1)].filter((n) => n != null);
  return { tipo, conteudo };
}
