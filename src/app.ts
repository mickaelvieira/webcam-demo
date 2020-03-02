import "core-js/stable";
import "regenerator-runtime/runtime";
import { makeCamera } from "./camera";
import { makeEditor } from "./editor";
import { makeUploadArea } from "./form";
import { makeTabs } from "./tabs";
import { PubSub } from "./events";

(function(): void {
  const channel = new PubSub();

  makeTabs();
  makeCamera(channel);
  makeUploadArea(channel);
  makeEditor(channel);
})();
