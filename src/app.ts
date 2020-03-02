import "core-js/stable";
import "regenerator-runtime/runtime";
import { initCamera } from "./camera";
import { initEditor } from "./editor";
import { initUploadArea } from "./form";
import { Tabs } from "./tabs";

(function(): void {
  const _ = new Tabs();
  const editor = initEditor();
  const camera = initCamera();
  const [form, drop] = initUploadArea();

  camera.on("change", image => {
    editor.updateImage(image);
  });
  form.on("change", image => {
    editor.updateImage(image);
  });
  drop.on("change", image => {
    editor.updateImage(image);
  });
})();
