import { Channel } from "../channel";
import { calculateAspectRatioFit, drawImage, getBoundaries } from "../helpers";
import { EventName } from "../types";

interface Props {
  canvas: HTMLCanvasElement;
  channel: Channel;
}

export default class Document {
  canvas: HTMLCanvasElement;
  channel: Channel;

  constructor({ canvas, channel }: Props) {
    this.canvas = canvas;
    this.channel = channel;
  }

  update(image: HTMLImageElement, angle = 0): void {
    const max = getBoundaries(this.canvas, angle);
    const sizes = calculateAspectRatioFit(
      image.width,
      image.height,
      max.width,
      max.height
    );

    drawImage(this.canvas, image, sizes, angle);

    this.channel.dispatch(EventName.DocumentWasUpdated, this.canvas);
  }
}
