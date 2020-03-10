import { Channel } from "../channel";

export async function initWasm(channel: Channel): Promise<void> {
  window.CanvasVideo = window.CanvasVideo || {};

  const go = new Go();
  const result = await WebAssembly.instantiateStreaming(
    fetch("main.wasm"),
    go.importObject
  );

  go.run(result.instance);
  window.CanvasVideo.initChannel(channel);
}
