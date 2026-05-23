export enum ResourceType {
  BookAll = "bookAll",
  BookCover = "bookCover",
  ItemAll = "itemAll",
  ItemCover = "itemCover",
  ItemOutlines = "itemOutlines",
}

export interface Resource {
  parentId: string;
  type: ResourceType;
}
