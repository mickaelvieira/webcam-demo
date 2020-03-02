import Editor, { EditorButtons } from "./editor";
import Preview from "./preview";
import Download from "./download";
import Document from "./document";
import { PubSub } from "../events";
import { getDOMElements } from "../helpers";

interface Elements extends EditorButtons {
  canvas1: HTMLCanvasElement;
  canvas2: HTMLCanvasElement;
  dl: HTMLAnchorElement;
}

function makeEditor(channel: PubSub): Editor {
  const elements = getDOMElements<Elements>({
    left: ".btn-rotate-left",
    right: ".btn-rotate-right",
    canvas1: ".preview",
    canvas2: ".canvas",
    dl: ".btn-download"
  });

  const { left, right, dl, canvas1, canvas2 } = elements;

  const preview = new Preview({ canvas: canvas1 });
  const document = new Document({ canvas: canvas2, channel });
  const download = new Download(dl);

  const editor = new Editor({
    document,
    preview,
    download,
    buttons: {
      left,
      right
    }
  });

  channel.subscribe("change", image => {
    editor.updateImage(image);
  });
  channel.subscribe("updated", doc => {
    editor.updateDownloadLink(doc);
  });

  return editor;
}

export { makeEditor, Editor, Preview, Download };
