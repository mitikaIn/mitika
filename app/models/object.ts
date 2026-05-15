import { type Position } from "@/models/item";

export enum ObjectType {
  Mark = "mark",
  Note = "note",
}

export interface Object {
  id: string;
  itemId: string;
  type: string;
}

export interface Mark extends Object {
  position: Position;
  name: string;
}

export function newMark(itemId: string, position: Position, name: string): Mark {
  const mark = { id: crypto.randomUUID(), itemId, type: ObjectType.Mark, position, name };
  return mark;
}

export interface Note extends Object {
  position: Position;
  name: string;
  description: string;
}

export function newNote(
  itemId: string,
  position: Position,
  name: string,
  description: string,
): Note {
  const note = {
    id: crypto.randomUUID(),
    itemId,
    type: ObjectType.Note,
    position,
    name,
    description,
  };
  return note;
}
