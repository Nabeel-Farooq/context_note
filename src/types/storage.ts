import type { Note } from "./note";
import type { Tag } from "./tag";
import { StorageKeys } from "@/utils/constant";

export interface Storage {
  readonly [StorageKeys.NOTES]: Note[];
  readonly [StorageKeys.TAGS]: Tag[];
}
