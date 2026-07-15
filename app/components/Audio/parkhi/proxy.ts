import type { Request, Response } from "@/components/Audio/parkhi/common";
import { useLogging } from "@/logging";
import { type Metadata } from "@mitikaIn/parkhi";
import { LogLevel } from "@mitikaIn/parkhi/logging";

const { debug, info, warn, error } = useLogging("parkhi");

function onLogMessage(level: LogLevel, component: string, message: string) {
  const msg = `${component}: ${message}`;

  if (level == LogLevel.Debug) debug(msg);
  else if (level == LogLevel.Info) info(msg);
  else if (level == LogLevel.Warn) warn(msg);
  else if (level == LogLevel.Error) error(msg);
  else throw new Error(`unknown log level ${level}`);
}

export class Proxy {
  private readyPromise = Promise.withResolvers<null>();
  private donePromise = Promise.withResolvers<Metadata | null>();

  private async onMessage(message: MessageEvent) {
    const response = message.data as Response;

    if (response.type == "ready") {
      this.readyPromise.resolve(null);
    } else if (response.type == "log") {
      onLogMessage(response.level, response.component, response.message);
    } else if (response.type == "done") {
      this.donePromise.resolve(response.metadata);
    } else {
      throw new Error(`unknown response: ${response}`);
    }
  }

  async parse(blob: Blob): Promise<Metadata | null> {
    const worker = new Worker(new URL("./worker.ts", import.meta.url), { type: "module" });
    worker.addEventListener("message", (message) => this.onMessage(message));

    await this.readyPromise.promise;

    const request: Request = { type: "parse", blob };
    worker.postMessage(request);

    const metadata = await this.donePromise.promise;

    worker.terminate();

    return metadata;
  }
}
