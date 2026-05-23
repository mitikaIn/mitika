import { Client } from "./client";
import { type Outline } from "@/components/OutlinesDialogRow.vue";
import type { Chapter } from "@mitikaIn/parkhi";

export interface Metadata {
  name: string | null;
  authors: string[];
  cover: Blob | null;
  outlines: Outline[];
}

function toOutline(chapter: Chapter): Outline {
  const outline = {
    name: chapter.name,
    position: [chapter.position],
    children: chapter.children.map(toOutline),
  };

  return outline;
}

export async function getMetadata(blob: Blob): Promise<Metadata | null> {
  const client = new Client();

  const {
    name = null,
    authors = [],
    cover = null,
    chapters = [],
  } = (await client.parse(blob)) || {};
  const outlines = chapters.map(toOutline);
  const metadata = { name, authors, cover, outlines };

  return metadata;
}
