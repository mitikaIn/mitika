import type { Request, Response } from "@/components/Audio/parkhi/common";
import { type Metadata, Parkhi, ParkhiError } from "@mitikaIn/parkhi";
import { LogLevel, setLogFunction } from "@mitikaIn/parkhi/logging";

function postLogMessage(level: LogLevel, component: string, message: string) {
  const log: Response = { type: "log", level, component, message };
  postMessage(log);
}

function componentLogFunction(level: LogLevel): (component: string, message: string) => void {
  return (component, message) => postLogMessage(level, component, message);
}

for (const level of [LogLevel.Debug, LogLevel.Info, LogLevel.Warn, LogLevel.Error])
  setLogFunction(level, componentLogFunction(level));

async function parse(data: Uint8Array): Promise<Metadata | null> {
  const parkhi = new Parkhi();

  if (!(await parkhi.feed(data))) await parkhi.feed(null);

  return await parkhi.getMetadata();
}

async function onMessage(message: MessageEvent) {
  const request = message.data as Request;
  if (request.type != "parse") throw new Error(`unknown request ${request}`);

  const blob = request.blob;
  const data = new Uint8Array(await blob.arrayBuffer());

  let metadata = null;
  try {
    metadata = await parse(data);
  } catch (e) {
    postLogMessage(LogLevel.Error, "worker", "failed to get metadata");

    let error;
    if (e instanceof ParkhiError) error = e.message;
    else error = `{e}`;

    postLogMessage(LogLevel.Error, "worker", error);
  }

  const done: Response = { type: "done", metadata };

  postMessage(done);
}

addEventListener("message", onMessage);

const ready: Response = { type: "ready" };
postMessage(ready);
