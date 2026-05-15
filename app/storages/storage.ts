export interface Storage {
  id: string;
  read(path: string): Promise<Blob | null>;
  write(path: string, blob: Blob): Promise<void>;
  remove(path: string): Promise<void>;
}
