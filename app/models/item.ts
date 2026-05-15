import { type File } from "@/models/file";

export type Position = number[];

export function collatePosition(a: Position, b: Position): number {
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const diff = a[i]! - b[i]!;
    if (diff != 0) return diff;
  }
  return 0;
}

export enum ItemType {
  Audio = "audio",
  Pdf = "pdf",
}

export interface Item {
  id: string;
  type: ItemType;
  bookId: string;
  order: number;
  name: string;
  file: File;
  position: Position;
  openingFirstTime: boolean;
}
