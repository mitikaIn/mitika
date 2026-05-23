import { type File } from "@/models/file";
import { type Item, ItemType, type Position } from "@/models/item";
import { type Object } from "@/models/object";

export enum PdfLayout {
  Single = "single",
  DualStart = "dualStart",
  DualEnd = "dualEnd",
}

export type PdfPosition = Position & [page: number, y: number, x: number];

export enum PdfResizePolicy {
  None = "none",
  FitWidth = "fitWidth",
  FitHeight = "fitHeight",
  FitPage = "fitPage",
}

export interface Pdf extends Item {
  position: PdfPosition;
  black: number;
  white: number;
  flip: boolean;
  layout: PdfLayout;
  rotate: number;
  scale: number;
  resizePolicy: PdfResizePolicy;
}

export enum PdfObjectType {
  Annotation = "annotation",
}

export interface PdfAnnotation extends Object {
  type: PdfObjectType.Annotation;
  position: PdfPosition;
  width: number;
  height: number;
}

export function newPdf(bookId: string, name: string, file: File): Pdf {
  const pdf = {
    id: window.crypto.randomUUID(),
    type: ItemType.Pdf,
    bookId,
    order: 1,
    name,
    file,
    openingFirstTime: true,
    temporaryName: true,
    position: [0, 0, 0] as PdfPosition,
    black: 0xffffff,
    white: 0xffffff,
    flip: false,
    layout: PdfLayout.DualEnd,
    rotate: 0,
    scale: 1,
    resizePolicy: PdfResizePolicy.FitPage,
  };
  return pdf;
}
