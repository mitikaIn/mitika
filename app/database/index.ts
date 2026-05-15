import { type Database } from "@/database/database";
import { IndexedDb } from "@/database/indexedDb";
import { useLogger } from "@/logging";

const { debug } = useLogger("database");

let database: Database;

export async function useDatabase(): Promise<Database> {
  if (database) return database;

  if (window.indexedDB) database = new IndexedDb();
  else throw new Error("Unknown database");

  await database.open();

  debug(`Using database: ${database.id}`);
  return database;
}

export { type Database };
