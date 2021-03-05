import { Channel } from "../channel";
import { getDOMElements } from "../helpers";
import { EventName } from "../types";
import Document from "./document";
import Download from "./download";
import Editor, { EditorButtons } from "./editor";
import Preview from "./preview";

interface Elements extends EditorButtons {
  canvas1: HTMLCanvasElement;
  canvas2: HTMLCanvasElement;
  dl: HTMLAnchorElement;
}

function makeEditor(channel: Channel): Editor {
  const elements = getDOMElements<Elements>({
    left: ".btn-rotate-left",
    right: ".btn-rotate-right",
    canvas1: ".preview",
    canvas2: ".canvas",
    dl: ".btn-download",
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
      right,
    },
  });

  channel.subscribe(EventName.ImageWasUpdated, (image: HTMLImageElement) => {
    editor.updateImage(image);
  });
  channel.subscribe(EventName.DocumentWasUpdated, (canvas: HTMLCanvasElement) => {
    editor.updateDownloadLink(canvas);
  });

  return editor;
}

export { makeEditor, Editor, Preview, Download };
