import { Channel } from "./channel";

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
  SourceWasUpdated = "source_updated",
  DocumentWasUpdated = "document_updated"
}

export interface WasmModule {
  initChannel(channel: Channel): void;
}

declare global {
  interface Window {
    CanvasVideo: WasmModule;
  }

  /* eslint @typescript-eslint/no-explicit-any: off */
  class Go {
    importObject: {
      go: {
        [name: string]: (args: any) => void;
      };
    };
    constructor();
    run(instance: any): Promise<any>;
  }
}
