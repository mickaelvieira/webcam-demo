import { initCamera } from "./camera";
import { initEditor } from "./editor";
import { initForm } from "./form";
import { Tabs } from "./tabs";

(function() {
  const _ = new Tabs();
  const editor = initEditor();
  const camera = initCamera();
  const [form, drop] = initForm();

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
