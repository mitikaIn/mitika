import { type Metadata } from "@mitikaIn/parkhi";
import type { LogLevel } from "@mitikaIn/parkhi/logging";

export type Request = { type: "parse"; blob: Blob };

export type Response =
  | {
      type: "done";
      metadata: Metadata | null;
    }
  | { type: "log"; level: LogLevel; component: string; message: string }
  | { type: "ready" };
