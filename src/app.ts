import "core-js/stable";
import "regenerator-runtime/runtime";
import { initWasm } from "./wasm";
import { makeCamera } from "./camera";
import { makeEditor } from "./editor";
import { makeUploadArea } from "./form";
import { makeTabs } from "./tabs";
import { Channel } from "./channel";

(function(): void {
  const channel = new Channel();

  channel.subscribe("wasm", function(...args) {
    console.log(args[0]);
  });

  initWasm(channel);
  makeTabs();
  makeCamera(channel);
  makeUploadArea(channel);
  makeEditor(channel);
})();
