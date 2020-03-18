import { Dimensions, Format } from "./types";

export function readFileContent(file: File): Promise<string> {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  return new Promise((resolve, reject) => {
    reader.onload = (event): void => {
      resolve((event.target as FileReader).result as string);
    };
    reader.onerror = (): void => {
      reject(new Error("Cannot read the file"));
    };
  });
}

export function loadImageData(source: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.src = source;
  return new Promise((resolve, reject) => {
    image.onload = (event): void => {
      resolve(event.target as HTMLImageElement);
    };
    image.onerror = (): void => {
      reject(new Error("Cannot read the image"));
    };
  });
}

export function calculateAspectRatioFit(
  srcWidth: number,
  srcHeight: number,
  maxWidth: number,
  maxHeight: number
): Dimensions {
  const ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

  return {
    width: srcWidth * ratio,
    height: srcHeight * ratio
  };
}

export function drawImage(
  canvas: HTMLCanvasElement,
  image: HTMLImageElement,
  shape: Dimensions,
  angle: number
): void {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Cannot get 2d context");
  }

  const { width: canvasWidth, height: canvasHeight } = canvas;
  const { width: shapeWidth, height: shapeHeight } = shape;

  // save current state
  ctx.save();

  // clear previous drawing
  ctx.clearRect(0, 0, canvasWidth, canvasHeight);

  // apply background
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, canvasWidth, canvasHeight);

  // align shape's center with canvas' center
  const canvasCenterX = canvasWidth / 2;
  const canvasCenterY = canvasHeight / 2;

  ctx.translate(canvasCenterX, canvasCenterY);
  ctx.translate((shapeWidth / 2) * -1, (shapeHeight / 2) * -1);

  // rotate image
  const shapeCenterX = shapeWidth / 2;
  const shapeCenterY = shapeHeight / 2;

  ctx.translate(shapeCenterX, shapeCenterY);
  ctx.rotate((Math.PI / 180) * angle);
  ctx.translate(-shapeCenterX, -shapeCenterY);

  // Draw image at the given coordinates
  ctx.drawImage(
    image,
    0,
    0,
    image.naturalWidth,
    image.naturalHeight,
    0,
    0,
    shapeWidth,
    shapeHeight
  );

  // restore previously saved state
  ctx.restore();
}

export function isPortrait(): boolean {
  return window.innerHeight > window.innerWidth;
}

export function isLandscape(): boolean {
  return window.innerHeight < window.innerWidth;
}

export function calculateRatio(format: Format = Format.Standard): number {
  if (format === Format.Standard) {
    return 4 / 3;
  } else if (format === Format.Wide) {
    return 16 / 9;
  }
  throw new Error("Unsupported format");
}

export function calculateFitSize(
  size: number,
  format: Format = Format.Standard
): number {
  if (format === Format.Standard) {
    return (size * 3) / 4;
  } else if (format === Format.Wide) {
    return (size * 9) / 16;
  }
  throw new Error("Unsupported format");
}

interface Input {
  [name: string]: string;
}

export function getDOMElements<T>(selectors: Input): T {
  const elements = Object.create(null);
  for (const [name, selector] of Object.entries(selectors)) {
    const element = document.querySelector(selector);
    if (!element) {
      throw new Error(`Cannot find DOM element with selector ${selector}`);
    }
    elements[name] = element;
  }
  return elements;
}

export function getBoundaries(
  { width, height }: Dimensions,
  angle: number
): Dimensions {
  if (angle === 90 || angle === 270) {
    [width, height] = [height, width];
  }
  return { width, height };
}
