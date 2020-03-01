import EventEmitter from "../events";
import { Dimensions } from "../types";
import {
  drawImage,
  calculateAspectRatioFit,
  isLandscape,
  calculateFitSize
} from "../helpers";

export enum Direction {
  ClockWise = 1,
  NoDirection = 0,
  AntiClockWise = -1
}

export default class Canvas extends EventEmitter {
  canvas: HTMLCanvasElement;

  rate = 15;

  curAngle = 0;

  prevAngle = 0;

  nextAngle = 0;

  constructor(canvas: HTMLCanvasElement, adjust = false) {
    super();
    this.canvas = canvas;

    if (adjust) {
      const mq = window.matchMedia("(min-width: 600px)");
      this.adjust(mq.matches);
      mq.addListener(event => this.adjust(event.matches));
    }
  }

  adjust = (matches: boolean) => {
    const lgWidth = 600;
    const lgHeight = calculateFitSize(lgWidth);
    const smWidth = 300;
    const smHeight = calculateFitSize(smWidth);

    let width = smWidth;
    let height = smHeight;

    if (matches) {
      width = lgWidth;
      height = lgHeight;
    }

    if (!isLandscape()) {
      [width, height] = [height, width];
    }

    // This will clear the canvas
    this.canvas.width = width;
    this.canvas.height = height;
  };

  update(
    image: HTMLImageElement,
    angle = 0,
    dir: Direction = Direction.NoDirection
  ) {
    if (dir === Direction.AntiClockWise && this.prevAngle === 0) {
      this.prevAngle = 360;
    }
    if (dir === Direction.ClockWise && angle === 0) {
      angle = 360;
    }

    this.nextAngle = angle;
    this.curAngle = this.prevAngle;

    const max = this.getBoundaries(this.canvas, this.nextAngle);

    const sizes = calculateAspectRatioFit(
      image.width,
      image.height,
      max.width,
      max.height
    );

    if (dir === Direction.NoDirection) {
      drawImage(this.canvas, image, sizes, this.curAngle);
      this.emit("update");
    } else {
      window.requestAnimationFrame(() => this.animate(image, sizes, dir));
    }
  }

  animate(image: HTMLImageElement, sizes: Dimensions, dir: Direction) {
    drawImage(this.canvas, image, sizes, this.curAngle);

    if (this.shouldAnimate(dir)) {
      this.curAngle = this.curAngle + this.rate * dir;
      window.requestAnimationFrame(() => this.animate(image, sizes, dir));
    } else {
      this.emit("update");
      this.prevAngle = this.curAngle === 360 ? 0 : this.curAngle;
    }
  }

  shouldAnimate(dir: Direction) {
    if (dir === Direction.ClockWise) {
      return this.curAngle < this.nextAngle;
    }
    if (dir === Direction.AntiClockWise) {
      return this.curAngle > this.nextAngle;
    }
    return false;
  }

  getBoundaries({ width, height }: Dimensions, angle: number) {
    return angle === 90 || angle === 270
      ? { width: height, height: width }
      : { width, height };
  }

  getDataURL() {
    return this.canvas.toDataURL();
  }
}
