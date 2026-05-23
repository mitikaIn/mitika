import { useLogging } from "@/logging";
import { type Resource, ResourceType } from "@/storages/resource";
import { type Storage } from "@/storages/storage";

const { debug } = useLogging("opfs");

function split(path: string): { segments: string[]; fileName: string } {
  if (!path.startsWith("/") || path.endsWith("/")) throw new Error(`Invalid path: ${path}`);

  let segments = path.split("/");
  segments.shift();

  const fileName = segments.pop();
  if (!fileName) throw new Error(`Invalid path: ${path}`);

  return { segments, fileName };
}

export function resourceToPath(resource: Resource): string {
  const { parentId, type } = resource;

  if (type == ResourceType.BookAll) return `/books/${parentId}`;
  else if (type == ResourceType.BookCover) return `/books/${parentId}/cover`;
  else if (type == ResourceType.ItemAll) return `/items/${parentId}`;
  else if (type == ResourceType.ItemCover) return `/items/${parentId}/cover`;
  else if (type == ResourceType.ItemOutlines) return `/items/${parentId}/outlines.json`;
  else throw new Error(`unknown type ${type}`);
}

export class Opfs implements Storage {
  id = "opfs";

  private async getDirectory(
    segments: string[],
    create: boolean = false,
  ): Promise<FileSystemDirectoryHandle> {
    let dir = await navigator.storage.getDirectory();
    for (const segment of segments) dir = await dir.getDirectoryHandle(segment, { create });
    return dir;
  }

  async read(resource: Resource): Promise<Blob | null> {
    const path = resourceToPath(resource);
    const { segments, fileName } = split(path);
    debug(`Reading ${fileName}`);

    let directory;
    try {
      directory = await this.getDirectory(segments);
    } catch {
      return null;
    }

    let handle;
    try {
      handle = await directory.getFileHandle(fileName);
    } catch (e) {
      debug(`failed to read ${fileName} due to ${e}`);
      return null;
    }

    const blob = await handle.getFile();
    debug(`Read ${fileName}`);

    return blob;
  }

  async write(resource: Resource, blob: Blob) {
    const path = resourceToPath(resource);
    const { segments, fileName } = split(path);
    debug(`Writing ${fileName}`);

    const directory = await this.getDirectory(segments, true);
    const handle = await directory.getFileHandle(fileName, { create: true });
    const stream = await handle.createWritable();
    await stream.write(blob);
    await stream.close();

    debug(`Wrote ${fileName}`);
  }

  async remove(resource: Resource) {
    const path = resourceToPath(resource);
    const { segments, fileName } = split(path);
    debug(`Removing ${fileName}`);

    try {
      const directory = await this.getDirectory(segments);
      await directory.removeEntry(fileName, { recursive: true });
    } catch {}

    debug(`Removed ${fileName}`);
  }
}
