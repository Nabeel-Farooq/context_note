export interface Coor {
  readonly x: number;
  readonly y: number;
}

export interface Rect {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly id?: string;
}

export interface Oper {
  readonly title: string;
  readonly onClick: () => void;
  readonly isConfirm?: boolean;
}

export type Point = Coor;

export interface Size {
  readonly width: number;
  readonly height: number;
}

export interface Rectangle extends Rect {}
