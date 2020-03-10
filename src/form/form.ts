import Message from "../message/message";
import { loadImage, readAsDataURL, readAsArrayBuffer } from "../helpers";
import { Channel } from "../channel";
import { EventName } from "../types";

export interface FormButtons {
  open: HTMLButtonElement;
}

interface Props {
  form: HTMLFormElement;
  message: Message;
  channel: Channel;
  buttons: FormButtons;
}

export default class Form {
  form: HTMLFormElement;
  message: Message;
  channel: Channel;

  constructor({ form, message, channel, buttons: { open } }: Props) {
    this.form = form;
    this.message = message;
    this.channel = channel;

    this.form.addEventListener("submit", this.handleSubmit);
    this.form.image.addEventListener("change", this.handleChange);

    open.addEventListener("click", this.handleClick);
  }

  handleClick = (): void => {
    this.form.image.click();
  };

  handleSubmit = (event: Event): void => {
    event.preventDefault();
  };

  handleChange = async (event: Event): Promise<void> => {
    this.message.clear();

    const file = this.getFileFromEvent(event);

    if (file) {
      try {
        const url = await readAsDataURL(file);
        const bytes = await readAsArrayBuffer(file);
        const image = await loadImage(url);
        const i = document.querySelector(".image-cache");
        console.log("---");
        console.log(image);
        i.src = image.src;
        console.log(i);
        console.log("---");
        this.channel.dispatch(EventName.SourceWasUpdated, bytes);
        this.channel.dispatch(EventName.ImageWasUpdated, image);
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
