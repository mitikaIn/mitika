export interface Book {
  id: string;
  name: string;
  authors: string[];
  tags: Set<string>;
  lastOpened: Date;
  focus: boolean;
  openingFirstTime: boolean;
  temporaryName: boolean;
  temporaryAuthors: boolean;
  lastAudioId: string | null;
  lastPdfId: string | null;
}

export function newBook(name: string): Book {
  return {
    id: window.crypto.randomUUID(),
    name,
    authors: [],
    tags: new Set(),
    lastOpened: new Date(),
    focus: false,
    openingFirstTime: true,
    temporaryName: true,
    temporaryAuthors: true,
    lastAudioId: null,
    lastPdfId: null,
  };
}
