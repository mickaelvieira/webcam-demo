import Message from "./message";
import { loadImageData, readFileContent, getDOMElements } from "../helpers";
import EventEmitter from "../events";
import DragAndDrop from "./drop";

interface Buttons {
  open: HTMLButtonElement;
}

interface Elements extends Buttons {
  form: HTMLFormElement;
  msg: HTMLDivElement;
  dropArea: HTMLDivElement;
}

interface Props {
  form: HTMLFormElement;
  message: Message;
  buttons: Buttons;
}

export default class Form extends EventEmitter {
  form: HTMLFormElement;
  message: Message;

  constructor({ form, message, buttons: { open } }: Props) {
    super();

    this.form = form;
    this.message = message;

    this.form.addEventListener("submit", this.handleSubmit);
    this.form.image.addEventListener("change", this.handleChange);
    open.addEventListener("click", this.handleClick);
  }

  handleClick = () => {
    this.form.image.click();
  };

  handleSubmit = (event: Event) => {
    event.preventDefault();
  };

  handleChange = async (event: Event) => {
    this.message.clear();

    const file = this.getFileFromEvent(event);

    if (file) {
      try {
        const data = await readFileContent(file);
        const image = await loadImageData(data);
        this.emit("change", image);
        this.message.info("Preview updated!");
      } catch (err) {
        this.message.error(err.message);
      }
    } else {
      this.message.error("No file available");
    }
  };

  getFileFromEvent(event: Event): File | null {
    if (!event.target) {
      return null;
    }
    if (!("files" in event.target)) {
      return null;
    }

    const files = (event.target as HTMLInputElement).files as FileList;
    if (files.length === 0) {
      return null;
    }
    return files[0];
  }
}

export function initForm() {
  const elements = getDOMElements<Elements>({
    msg: ".form-message",
    dropArea: ".drop-area",
    form: ".form-image",
    open: ".btn-open-files"
  });

  const { msg, dropArea, form, open } = elements;

  const message = new Message(msg);
  const formUpload = new Form({ form, message, buttons: { open } });
  const dropZone = new DragAndDrop({ message, dropArea });

  return [formUpload, dropZone];
}
