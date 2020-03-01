import Download from "./download";
import Canvas from "./canvas";
import { Direction } from "./canvas";

interface Props {
  preview: Canvas;
  canvas: Canvas;
  download: Download;
  buttons: {
    left: HTMLButtonElement;
    right: HTMLButtonElement;
  };
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
    right.addEventListener("click", this.counterRight);

    this.canvas.on("update", () => {
      this.download.update(this.canvas.getDataURL());
    });
  }

  updateImage(image: HTMLImageElement) {
    this.image = image;
    this.updateCanvas();
  }

  updateCanvas(dir = Direction.NoDirection) {
    if (!this.image) {
      return;
    }

    const angle = this.angles[this.angle];

    this.preview.update(this.image, angle, dir);
    this.canvas.update(this.image, angle, dir);
  }

  rotateLeft = () => {
    this.angle = this.angle + 1;
    if (this.angle >= this.angles.length) {
      this.angle = 0;
    }
    this.updateCanvas(Direction.ClockWise);
  };

  counterRight = () => {
    this.angle = this.angle - 1;
    if (this.angle < 0) {
      this.angle = this.angles.length - 1;
    }
    this.updateCanvas(Direction.AntiClockWise);
  };
}

export function initEditor() {
  const left = document.querySelector(".btn-rotate-left") as HTMLButtonElement;
  const right = document.querySelector(
    ".btn-rotate-right"
  ) as HTMLButtonElement;
  const canvas1 = document.querySelector(".preview") as HTMLCanvasElement;
  const canvas2 = document.querySelector(".canvas") as HTMLCanvasElement;
  const dl = document.querySelector(".btn-download") as HTMLAnchorElement;

  if (!left || !right || !canvas1 || !canvas2 || !dl) {
    throw new Error("Some DOM elements are missing");
  }

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
