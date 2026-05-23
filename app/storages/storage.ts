import { type Resource } from "@/storages/resource";

export interface Storage {
  id: string;
  read(resource: Resource): Promise<Blob | null>;
  write(resource: Resource, blob: Blob): Promise<void>;
  remove(resource: Resource): Promise<void>;
}
