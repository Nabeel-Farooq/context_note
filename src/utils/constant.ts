export enum StorageKeys {
  NOTES = "notes",
  TAGS = "tags",
}

export const DOMATTR_RECT_GROUP = "note-id" as const;

export const PREFIX_RECT = "rect" as const;
export const PREFIX_RECT_GROUP = "note" as const; // Rects belong to a note group

export enum AppWidth {
  NORMAL = 500,
  EXPANDED = 1500,
}

export const APP_WIDTH_VALUES = Object.freeze({
  normal: AppWidth.NORMAL,
  expanded: AppWidth.EXPANDED,
} as const);

export const STORAGE_KEYS = Object.freeze([
  StorageKeys.NOTES,
  StorageKeys.TAGS,
] as const);
