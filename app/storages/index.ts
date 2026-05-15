import { useLogger } from "@/logging";
import { Opfs } from "@/storages/opfs";
import { type Storage } from "@/storages/storage";

const { debug } = useLogger("storage");

let storage: Storage;

export async function useStorage(): Promise<Storage> {
  if (storage) return storage;

  if (navigator.storage) storage = new Opfs();
  else throw new Error("Unknown storage");

  debug(`Using storage: ${storage.id}`);
  return storage;
}

export { type Storage };
