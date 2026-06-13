import { getObjectType } from "../utils/utils";

export const getNodeText = (node: Node | null | undefined): string => {
  if (!node) {
    return "";
  }

  const objectType = getObjectType(node);

  switch (objectType) {
    case "[object HTMLTimeElement]":
      return (node as HTMLTimeElement).dateTime?.trim() ?? "";

    case "[object Text]":
      return node.textContent?.trim() ?? "";

    case "[object HTMLSpanElement]":
      return (node as HTMLSpanElement).innerText?.trim() ?? "";

    default: {
      if (node instanceof Text) {
        return node.textContent?.trim() ?? "";
      }

      if (node instanceof HTMLElement) {
        if (node instanceof HTMLTimeElement) {
          return node.dateTime?.trim() ?? "";
        }

        return node.innerText?.trim() ?? "";
      }

      return "";
    }
  }
};
