/// <reference types="wicg-file-system-access" />
import { type Filter, extensionToMimeType, mimeTypeToExtension } from "@/components/Sources/common";
import { useLogger } from "@/logging";
import { type File as ModelFile } from "@/models";
import { splitBaseName } from "@/utils";

export interface LocalFile extends ModelFile {
  storageId: string;
  handle: FileSystemFileHandle;
}

const { debug } = useLogger("local");

const FSA_ID = "fsa";
const OPFS_ID = "opfs";
export const SOURCE_ID = "local";

async function fsaChooseFiles(multiple: boolean, filters: Filter[]): Promise<LocalFile[]> {
  const types: FilePickerAcceptType[] = [];
  for (const filter of filters) {
    const description = filter.name;
    const accept: Record<MIMEType, FileExtension> = {};
    for (const type of filter.types) accept[type] = `.${mimeTypeToExtension(type)}`;
    types.push({ description, accept });
  }

  const handles: FileSystemFileHandle[] = await window.showOpenFilePicker({
    excludeAcceptAllOption: true,
    multiple,
    startIn: "documents",
    types,
  });

  const files = handles.map((handle) => {
    const baseName = handle.name;
    const type = extensionToMimeType(splitBaseName(baseName).extension);
    return {
      name: baseName,
      type,
      sourceId: SOURCE_ID,
      storageId: FSA_ID,
      handle,
    };
  });

  return files;
}

async function fsaReadFile(file: LocalFile): Promise<Blob> {
  if (!((await file.handle.queryPermission({ mode: "read" })) == "granted"))
    if (!((await file.handle.requestPermission({ mode: "read" })) == "granted"))
      throw Error(`Permission denied to read file: ${file.name}`);
  const blob = await file.handle.getFile();
  return blob;
}

async function fsaDropFile(_file: LocalFile) {}

async function opfsGetStorageDir(): Promise<FileSystemDirectoryHandle> {
  const root = await navigator.storage.getDirectory();
  return await root.getDirectoryHandle("local", { create: true });
}

async function opfsCreateFile(dir: FileSystemDirectoryHandle, file: File): Promise<LocalFile> {
  const handleName = window.crypto.randomUUID();
  debug(`Copying ${file.name} to ${handleName}`);
  const handle = await dir.getFileHandle(handleName, { create: true });
  const stream = await handle.createWritable();
  await stream.write(file);
  await stream.close();
  const baseName = file.name;
  const type = extensionToMimeType(splitBaseName(baseName).extension);
  debug(`Copied ${file.name} to ${handleName}`);
  return { name: baseName, type, sourceId: SOURCE_ID, storageId: OPFS_ID, handle };
}

async function opfsChooseFiles(multiple: boolean, filters: Filter[]): Promise<LocalFile[]> {
  const input = document.createElement("input");
  input.type = "file";
  input.multiple = multiple;
  input.accept = filters
    .map((filter) => filter.types.map((type) => `.${mimeTypeToExtension(type)}`))
    .flat()
    .join(",");

  const files: LocalFile[] = await new Promise((resolve) => {
    input.oncancel = () => resolve([]);
    input.onchange = async () => {
      if (!input.files) return resolve([]);
      const dir = await opfsGetStorageDir();
      const files: LocalFile[] = [];
      for (const file of input.files) files.push(await opfsCreateFile(dir, file));
      resolve(files);
    };
    input.click();
  });

  return files;
}

async function opfsReadFile(file: LocalFile): Promise<Blob> {
  const blob = await file.handle.getFile();
  return blob;
}

async function opfsDropFile(file: LocalFile) {
  const dir = await opfsGetStorageDir();
  await dir.removeEntry(file.handle.name);
}

export async function chooseFiles(multiple: boolean, filters: Filter[]): Promise<LocalFile[]> {
  if ("showOpenFilePicker" in window) return fsaChooseFiles(multiple, filters);
  else return opfsChooseFiles(multiple, filters);
}

export async function readFile(file: LocalFile): Promise<Blob> {
  if (file.storageId == FSA_ID) return fsaReadFile(file);
  else if (file.storageId == OPFS_ID) return opfsReadFile(file);
  else throw new Error(`Unknown storageId: ${file.storageId}`);
}

export async function dropFile(file: LocalFile) {
  if (file.storageId == FSA_ID) return fsaDropFile(file);
  else if (file.storageId == OPFS_ID) return opfsDropFile(file);
  else throw new Error(`Unknown storageId: ${file.storageId}`);
}
