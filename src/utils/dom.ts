export const getNodeText = (node: Node | null | undefined): string => {
  if (!node) {
    return "";
  }

  if (node instanceof HTMLTimeElement) {
    return node.dateTime.trim();
  }

  if (node instanceof Text) {
    return node.textContent?.trim() ?? "";
  }

  if (node instanceof HTMLElement) {
    return node.innerText.trim();
  }

  return "";
};
