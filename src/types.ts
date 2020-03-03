export interface Dimensions {
  width: number;
  height: number;
}

export enum Format {
  Wide = "wide",
  Standard = "standard"
}

export enum EventName {
  ImageWasUpdated = "image_updated",
  DocumentWasUpdated = "document_updated"
}
