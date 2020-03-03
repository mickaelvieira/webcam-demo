import { Channel } from "../channel";
import { Dimensions } from "../types";
import { drawImage, calculateAspectRatioFit } from "../helpers";
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
    const max = this.getBoundaries(this.canvas, angle);
    const sizes = calculateAspectRatioFit(
      image.width,
      image.height,
      max.width,
      max.height
    );

    drawImage(this.canvas, image, sizes, angle);
    this.channel.dispatch(EventName.DocumentWasUpdated, this.canvas);
  }
  getBoundaries({ width, height }: Dimensions, angle: number): Dimensions {
    return angle === 90 || angle === 270
      ? { width: height, height: width }
      : { width, height };
  }
}
