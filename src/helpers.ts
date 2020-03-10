import { Dimensions, Format } from "./types";

export function readAsDataURL(file: File): Promise<string> {
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

export function readAsArrayBuffer(file: File): Promise<Uint8Array> {
  const reader = new FileReader();
  reader.readAsArrayBuffer(file);
  return new Promise((resolve, reject) => {
    reader.onload = (event): void => {
      resolve(
        new Uint8Array((event.target as FileReader).result as ArrayBuffer)
      );
    };
    reader.onerror = (): void => {
      reject(new Error("Cannot read the file"));
    };
  });
}

export function convertBytesToBlob(bytes: Uint8Array, type: string): Blob {
  return new Blob([bytes], { type });
}

export function loadImage(source: string): Promise<HTMLImageElement> {
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

export function getCanvasData(canvas: HTMLCanvasElement): Uint8Array {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Cannot get 2d context");
  }

  const image = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = image.data;
  const buffer = new ArrayBuffer(data.length);
  const binary = new Uint8Array(buffer);

  for (let i = 0; i < binary.length; i++) {
    binary[i] = data[i];
  }
  return binary;
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

interface Selectors {
  [name: string]: string;
}

export function getDOMElements<T>(selectors: Selectors): T {
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
