import { Channel } from "../channel";
import Form, { FormButtons } from "./form";
import DragAndDrop from "./drop";
import { getDOMElements } from "../helpers";
import Message from "../message/message";

interface Elements extends FormButtons {
  form: HTMLFormElement;
  msg: HTMLDivElement;
  dropArea: HTMLDivElement;
}

function makeUploadArea(channel: Channel): [Form, DragAndDrop] {
  const elements = getDOMElements<Elements>({
    msg: ".form-message",
    dropArea: ".drop-area",
    form: ".form-image",
    open: ".btn-open-files"
  });

  const { msg, dropArea, form, open } = elements;

  const message = new Message(msg);
  const formUpload = new Form({ form, message, channel, buttons: { open } });
  const dropZone = new DragAndDrop({ message, dropArea, channel });

  return [formUpload, dropZone];
}

export { Form, makeUploadArea };
