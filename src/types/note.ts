import type { Delta } from "@vueup/vue-quill";
import type { Rect } from "./common";

export interface Note {
  readonly id: string;
  readonly createTime: number;
  readonly updateTime: number;
  readonly link: string;
  readonly rawLink: string;
  readonly linkTitle: string;
  readonly content: string;
  readonly tags: readonly string[];
  readonly rects: readonly Rect[];
  readonly note?: Delta;
}
