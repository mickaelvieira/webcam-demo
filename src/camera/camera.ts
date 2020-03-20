import { Channel } from "../channel";
import { Format, EventName } from "../types";
import { loadImageData, calculateRatio } from "../helpers";
import Logger from "../logger";
import Message from "../message/message";

export interface CameraButtons {
  snap: HTMLButtonElement;
  start: HTMLButtonElement;
  stop: HTMLButtonElement;
  pip: HTMLButtonElement;
}

interface Props {
  video: HTMLVideoElement;
  snapshot: HTMLCanvasElement;
  message: Message;
  channel: Channel;
  logger?: Logger;
  buttons: CameraButtons;
}

export default class Camera {
  stream?: MediaStream;
  video: HTMLVideoElement;
  pip: HTMLButtonElement;
  message: Message;
  channel: Channel;
  snapshot: HTMLCanvasElement;
  logger?: Logger;

  constructor({
    video,
    snapshot,
    message,
    channel,
    logger,
    buttons: { snap, start, stop, pip }
  }: Props) {
    this.video = video;
    this.snapshot = snapshot;
    this.pip = pip;
    this.message = message;
    this.channel = channel;
    this.logger = logger;

    snap.addEventListener("click", this.snap);
    start.addEventListener("click", this.start);
    stop.addEventListener("click", this.stop);

    this.pip.addEventListener("click", this.handlePip);
    this.video.addEventListener("enterpictureinpicture", () => {
      this.log(`Picture In Picture mode entered`);
    });
    this.video.addEventListener("leavepictureinpicture", () => {
      this.log("Picture In Picture mode exited");
    });
    this.video.addEventListener("loadedmetadata", this.handleVideoChange);
    this.video.addEventListener("emptied", this.handleVideoChange);

    this.setPipButton();
    this.getDevices();
  }

  start = async (): Promise<void> => {
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

  stop = (): void => {
    this.log("Stop video");
    if (!this.isStreamActive()) {
      return;
    }
    for (const track of (this.stream as MediaStream).getTracks()) {
      track.stop();
    }
    this.log("All tracks were stopped");
  };

  snap = async (): Promise<void> => {
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

      this.channel.dispatch(EventName.ImageWasUpdated, image);
      this.log("Photo was created");
      this.message.info("Preview updated!");
      this.stop();
    } catch (err) {
      this.log(err);
    }
  };

  handlePip = async (): Promise<void> => {
    if (!this.video) {
      return;
    }

    this.log("Picture-in-Picture handler");

    try {
      if (this.video !== document.pictureInPictureElement) {
        await this.video.requestPictureInPicture();
      } else {
        await document.exitPictureInPicture();
      }
    } catch (err) {
      this.log(err);
    }
  };

  async getDevices(): Promise<void> {
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

  handleVideoChange = (): void => {
    this.setPipButton();
  };

  setPipButton(): void {
    const isDisabled =
      this.video.readyState === 0 ||
      !document.pictureInPictureEnabled ||
      this.video.disablePictureInPicture;

    if (!isDisabled) {
      this.pip.classList.add("active");
    } else {
      this.pip.classList.remove("active");
    }
  }

  log(message: string): void {
    if (this.logger) {
      this.logger.log(message);
    }
  }
}
