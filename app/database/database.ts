import { type Book, type Item, type Object } from "@/models";
import { type Key } from "@/models/settings";

export abstract class Database {
  id: string = "database";

  abstract open(): Promise<void>;
  abstract close(): Promise<void>;

  abstract putObject(object: Object): Promise<void>;
  abstract getObject<T extends Object>(id: string): Promise<T>;
  abstract getObjects<T extends Object>(itemId: string | null, type: string | null): Promise<T[]>;
  abstract delObject(mark: Object): Promise<void>;

  abstract putItem(item: Item): Promise<void>;
  abstract getItem(id: string): Promise<Item>;
  abstract getItems(bookId: string | null): Promise<Item[]>;
  abstract delItem(item: Item): Promise<void>;
  abstract updateItems(
    parentId: string,
    newItems: Item[],
    oldItems: Item[],
    delItems: Item[],
  ): Promise<void>;

  abstract putBook(book: Book): Promise<void>;
  abstract getBook(id: string): Promise<Book>;
  abstract getBooks(): Promise<Book[]>;
  abstract delBook(book: Book): Promise<void>;

  abstract getProperty<T>(key: Key, fallback: T): Promise<T>;
  abstract setProperty<T>(key: Key, value: T): Promise<void>;
}
