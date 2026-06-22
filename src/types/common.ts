export interface Point {
  readonly x: number
  readonly y: number
}

export interface Size {
  readonly width: number
  readonly height: number
}

export interface Rect extends Point, Size {
  readonly id?: string
}

export interface Operation {
  readonly title: string
  readonly onClick: () => void
  readonly isConfirm?: boolean
}
