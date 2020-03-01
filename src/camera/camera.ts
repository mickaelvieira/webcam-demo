import EventEmitter from "../events";
import { Format } from "../types";
import { loadImageData, calculateRatio, getDOMElements } from "../helpers";
import Logger from "../logger";
import { Message } from "../form";

interface Buttons {
  snap: HTMLButtonElement;
  start: HTMLButtonElement;
  stop: HTMLButtonElement;
}

interface Props {
  video: HTMLVideoElement;
  snapshot: HTMLCanvasElement;
  message: Message;
  logger?: Logger;
  buttons: Buttons;
}

interface Elements extends Buttons {
  video: HTMLVideoElement;
  snapshot: HTMLCanvasElement;
  msg: HTMLDivElement;
  logs: HTMLDivElement;
}

export default class Camera extends EventEmitter {
  stream?: MediaStream;
  video: HTMLVideoElement;
  message: Message;
  snapshot: HTMLCanvasElement;
  logger?: Logger;

  constructor({
    video,
    snapshot,
    message,
    logger,
    buttons: { snap, start, stop }
  }: Props) {
    super();

    this.video = video;
    this.snapshot = snapshot;
    this.message = message;
    this.logger = logger;

    snap.addEventListener("click", this.snap);
    start.addEventListener("click", this.start);
    stop.addEventListener("click", this.stop);

    this.getDevices();
  }

  start = async () => {
    this.log("Start video");

    try {
      const constraints = this.getStreamConstraints();
      this.stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.log("Stream was created");
      this.video.srcObject = this.stream;
      this.video.play();
      this.log("Video should be playing");
    } catch (err) {
      this.log(err);
    }
  };

  stop = () => {
    this.log("Stop video");
    if (!this.isStreamActive()) {
      return;
    }
    for (const track of (this.stream as MediaStream).getTracks()) {
      track.stop();
    }
    this.log("All tracks were stopped");
  };

  snap = async () => {
    this.log("Snap photo");

    try {
      if (!this.video || !this.isStreamActive()) {
        return;
      }

      this.snapshot.width = this.video.clientWidth;
      this.snapshot.height = this.video.clientHeight;

      const ctx = this.snapshot.getContext("2d");
      if (!ctx) {
        throw new Error("Cannot get 2d context");
      }

      ctx.drawImage(
        this.video,
        0,
        0,
        this.snapshot.width,
        this.snapshot.height
      );

      const data = this.snapshot.toDataURL("image/png");
      const image = await loadImageData(data);

      this.emit("change", image);
      this.log("Photo was created");
      this.message.info("Preview updated!");
      this.stop();
    } catch (err) {
      this.log(err);
    }
  };

  async getDevices() {
    const devices = await navigator.mediaDevices.enumerateDevices();
    for (const device of devices) {
      this.log(`${device.deviceId} [${device.kind}]: ${device.label}`);
    }
  }

  isStreamActive(): boolean {
    return typeof this.stream !== "undefined" && this.stream.active;
  }

  getStreamConstraints = (): MediaStreamConstraints => ({
    video: {
      facingMode: { ideal: "environment" },
      width: {
        ideal: this.video.clientWidth
      },
      aspectRatio: {
        ideal: calculateRatio(Format.Standard)
      }
    },
    audio: false
  });

  log(message: string) {
    if (this.logger) {
      this.logger.log(message);
    }
  }
}

export function initCamera() {
  const elements = getDOMElements<Elements>({
    start: ".btn-start-video",
    stop: ".btn-stop-video",
    snap: ".btn-capture-photo",
    msg: ".video-message",
    video: ".video",
    snapshot: ".capture",
    logs: ".camera-logs"
  });

  const { start, stop, snap, msg, video, snapshot, logs } = elements;

  const logger = new Logger(logs);
  const message = new Message(msg);

  return new Camera({
    video,
    snapshot,
    message,
    logger,
    buttons: {
      snap,
      start,
      stop
    }
  });
}
