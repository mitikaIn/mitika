export function extensionToMimeType(extension: string): `${string}/${string}` {
  switch (extension) {
    case "epub":
      return "application/epub+zip";
    case "m4b":
      return "audio/mp4";
    case "mp3":
      return "audio/mpeg";
    case "pdf":
      return "application/pdf";
    default:
      throw Error(`Unknown extension: ${extension}`);
  }
}

export function mimeTypeToExtension(type: `${string}/${string}`): string {
  switch (type) {
    case "application/epub+zip":
      return "epub";
    case "audio/mp4":
      return "m4b";
    case "audio/mpeg":
      return "mp3";
    case "application/pdf":
      return "pdf";
    default:
      throw Error(`Unknown type: ${type}`);
  }
}

export interface Filter {
  name: string;
  types: `${string}/${string}`[];
}
