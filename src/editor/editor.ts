import Download from "./download";
import Canvas from "./canvas";
import { Direction } from "./canvas";
import { getDOMElements } from "../helpers";

interface Buttons {
  left: HTMLButtonElement;
  right: HTMLButtonElement;
}

interface Elements extends Buttons {
  canvas1: HTMLCanvasElement;
  canvas2: HTMLCanvasElement;
  dl: HTMLAnchorElement;
}

interface Props {
  preview: Canvas;
  canvas: Canvas;
  download: Download;
  buttons: Buttons;
}

export default class Editor {
  preview: Canvas;
  canvas: Canvas;
  download: Download;

  image: HTMLImageElement | null = null;

  angle = 0;

  angles = [0, 90, 180, 270];

  constructor({ preview, canvas, download, buttons: { left, right } }: Props) {
    this.canvas = canvas;
    this.preview = preview;
    this.download = download;

    left.addEventListener("click", this.rotateLeft);
    right.addEventListener("click", this.rotateRight);

    this.canvas.on("update", () => {
      this.download.update(this.canvas.getDataURL());
    });
  }

  updateImage(image: HTMLImageElement): void {
    this.image = image;
    this.updateCanvas();
  }

  updateCanvas(dir = Direction.NoDirection): void {
    if (!this.image) {
      return;
    }

    const angle = this.angles[this.angle];

    this.preview.update(this.image, angle, dir);
    this.canvas.update(this.image, angle, dir);
  }

  rotateRight = (): void => {
    this.angle = this.angle + 1;
    if (this.angle >= this.angles.length) {
      this.angle = 0;
    }
    this.updateCanvas(Direction.ClockWise);
  };

  rotateLeft = (): void => {
    this.angle = this.angle - 1;
    if (this.angle < 0) {
      this.angle = this.angles.length - 1;
    }
    this.updateCanvas(Direction.AntiClockWise);
  };
}

export function initEditor(): Editor {
  const elements = getDOMElements<Elements>({
    left: ".btn-rotate-left",
    right: ".btn-rotate-right",
    canvas1: ".preview",
    canvas2: ".canvas",
    dl: ".btn-download"
  });

  const { left, right, dl, canvas1, canvas2 } = elements;

  const preview = new Canvas(canvas1, true);
  const canvas = new Canvas(canvas2);
  const download = new Download(dl);

  return new Editor({
    canvas,
    preview,
    download,
    buttons: {
      left,
      right
    }
  });
}
