import Download from "./download";
import Preview from "./preview";
import Document from "./document";
import { Direction } from "./preview";

export interface EditorButtons {
  left: HTMLButtonElement;
  right: HTMLButtonElement;
}

interface Props {
  preview: Preview;
  document: Document;
  download: Download;
  buttons: EditorButtons;
}

export default class Editor {
  preview: Preview;
  document: Document;
  download: Download;

  image: HTMLImageElement | null = null;

  angle = 0;

  angles = [0, 90, 180, 270];

  constructor({
    preview,
    document,
    download,
    buttons: { left, right }
  }: Props) {
    this.document = document;
    this.preview = preview;
    this.download = download;

    left.addEventListener("click", this.rotateLeft);
    right.addEventListener("click", this.rotateRight);
  }

  updateDownloadLink(canvas: HTMLCanvasElement): void {
    this.download.update(canvas.toDataURL());
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
    this.document.update(this.image, angle);
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
