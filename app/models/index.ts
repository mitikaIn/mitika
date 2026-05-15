import { newAudio } from "@/models/audio";
import { type Book, newBook } from "@/models/book";
import { type File } from "@/models/file";
import { type Item, ItemType, type Position } from "@/models/item";
import { type Object, ObjectType } from "@/models/object";
import { newPdf } from "@/models/pdf";

export { type Book, newBook };
export { type File };
export { type Item, ItemType, type Position };
export { type Object, ObjectType };

export const ITEM_TYPES_MAP: Map<File["type"], ItemType> = new Map([
  ["application/epub+zip", ItemType.Pdf],
  ["audio/mp4", ItemType.Audio],
  ["audio/mpeg", ItemType.Audio],
  ["application/pdf", ItemType.Pdf],
]);

export function newItem(bookId: string, name: string, file: File): Item {
  const type = ITEM_TYPES_MAP.get(file.type);
  if (type == ItemType.Audio) return newAudio(bookId, name, file);
  else if (type == ItemType.Pdf) return newPdf(bookId, name, file);
  else throw new Error(`Unknown type: ${type}`);
}
