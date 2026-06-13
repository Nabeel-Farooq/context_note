export interface Tag {
  readonly id: string;
  readonly name: string;
  readonly color: string;
  readonly noteIds: readonly string[];
  readonly updateTime: number;

  readonly isSelect?: boolean;
  readonly isCreating?: boolean;
}
