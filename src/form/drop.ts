import EventEmitter from "../events";
import { loadImageData, readFileContent } from "../helpers";
import Message from "./message";

interface Props {
  dropArea: HTMLDivElement;
  message: Message;
}

export default class DragAndDrop extends EventEmitter {
  dropArea: HTMLDivElement;
  message: Message;

  constructor({ dropArea, message }: Props) {
    super();

    this.dropArea = dropArea;
    this.message = message;

    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      this.dropArea.addEventListener(eventName, this.preventDefaults);
    });

    ["dragenter", "dragover"].forEach(eventName => {
      this.dropArea.addEventListener(eventName, this.highlight);
    });

    ["dragleave", "drop"].forEach(eventName => {
      this.dropArea.addEventListener(eventName, this.unhighlight);
    });

    this.dropArea.addEventListener("drop", this.onDrop, false);
  }

  preventDefaults = (event: Event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  highlight = () => {
    this.dropArea.classList.add("highlight");
  };

  unhighlight = () => {
    this.dropArea.classList.remove("highlight");
  };

  onDrop = async (event: DragEvent) => {
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

  getFileFromEvent(event: DragEvent): File | null {
    const data = event.dataTransfer;
    if (!data) {
      return null;
    }
    if (data.files.length === 0) {
      return null;
    }
    return data.files[0];
  }
}
