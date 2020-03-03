import "core-js/stable";
import "regenerator-runtime/runtime";
import { makeCamera } from "./camera";
import { makeEditor } from "./editor";
import { makeUploadArea } from "./form";
import { makeTabs } from "./tabs";
import { Channel } from "./channel";

(function(): void {
  const channel = new Channel();

  makeTabs();
  makeCamera(channel);
  makeUploadArea(channel);
  makeEditor(channel);
})();
