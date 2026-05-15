export function getBaseName(path: string): string {
  const baseName = path.split(/[\\/]/).pop();
  if (baseName == undefined) throw new Error(`Invalid path: ${path}`);
  return baseName;
}

export function splitBaseName(baseName: string): { name: string; extension: string } {
  const splits = baseName.split(".");
  if (splits.length == 0) throw new Error(`Invalid baseName: ${baseName}`);
  const extension = splits.pop()!;
  const name = splits.join(".");
  return { name, extension };
}

export function toTitleCase(str: string): string {
  let title = str.replaceAll(/-|_/g, " ");
  title = title
    .split(" ")
    .map((x) => x.slice(0, 1).toLocaleUpperCase() + x.slice(1))
    .join(" ");
  return title;
}
