import { type File } from "@/models/file";
import { type Item, ItemType, type Position } from "@/models/item";

export type AudioPosition = Position & [timestamp: number];

export interface Audio extends Item {
  position: AudioPosition;
  rate: number;
  volume: number;
}

export function newAudio(bookId: string, name: string, file: File): Audio {
  const audio = {
    id: window.crypto.randomUUID(),
    type: ItemType.Audio,
    bookId,
    order: 1,
    name,
    file,
    openingFirstTime: true,
    position: [0] as AudioPosition,
    rate: 1,
    volume: 1,
  };

  return audio;
}
