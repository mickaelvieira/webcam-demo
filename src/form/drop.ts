import { PubSub } from "../events";
import { loadImageData, readFileContent } from "../helpers";
import Message from "../message/message";

interface Props {
  dropArea: HTMLDivElement;
  message: Message;
  channel: PubSub;
}

export default class DragAndDrop {
  dropArea: HTMLDivElement;
  message: Message;
  channel: PubSub;

  constructor({ dropArea, message, channel }: Props) {
    this.dropArea = dropArea;
    this.message = message;
    this.channel = channel;

    ["dragenter", "dragover", "dragleave", "drop"].forEach(eventName => {
      this.dropArea.addEventListener(eventName, this.preventDefaults);
    });

    ["dragenter", "dragover"].forEach(eventName => {
      this.dropArea.addEventListener(eventName, this.highlight);
    });

    ["dragleave", "drop"].forEach(eventName => {
      this.dropArea.addEventListener(eventName, this.unhighlight);
    });

    this.dropArea.addEventListener("drop", this.onDrop);
  }

  preventDefaults = (event: Event): void => {
    event.preventDefault();
    event.stopPropagation();
  };

  highlight = (): void => {
    this.dropArea.classList.add("highlight");
  };

  unhighlight = (): void => {
    this.dropArea.classList.remove("highlight");
  };

  onDrop = async (event: DragEvent): Promise<void> => {
    const file = this.getFileFromEvent(event);

    if (file) {
      try {
        const data = await readFileContent(file);
        const image = await loadImageData(data);
        this.channel.dispatch("change", image);
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
