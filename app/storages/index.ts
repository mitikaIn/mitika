import { useLogging } from "@/logging";
import { Opfs } from "@/storages/opfs";
import { type Resource, ResourceType } from "@/storages/resource";
import { type Storage } from "@/storages/storage";

const { debug } = useLogging("storage");

let storage: Storage;

export async function useStorage(): Promise<Storage> {
  if (storage) return storage;

  if (navigator.storage) storage = new Opfs();
  else throw new Error("Unknown storage");

  debug(`Using storage: ${storage.id}`);
  return storage;
}

export { ResourceType, type Storage, type Resource };
