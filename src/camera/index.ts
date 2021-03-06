import { Channel } from "../channel";
import { getDOMElements } from "../helpers";
import Logger from "../logger";
import Message from "../message/message";
import Camera, { CameraButtons } from "./camera";

interface Elements extends CameraButtons {
  video: HTMLVideoElement;
  snapshot: HTMLCanvasElement;
  msg: HTMLDivElement;
  logs: HTMLDivElement;
}

function makeCamera(channel: Channel): Camera {
  const elements = getDOMElements<Elements>({
    start: ".btn-start-video",
    stop: ".btn-stop-video",
    snap: ".btn-capture-photo",
    pip: ".btn-pip",
    msg: ".video-message",
    video: ".video",
    snapshot: ".capture",
    logs: ".camera-logs",
  });

  const { start, stop, snap, pip, msg, video, snapshot, logs } = elements;

  const logger = new Logger(logs);
  const message = new Message(msg);

  return new Camera({
    video,
    snapshot,
    message,
    channel,
    logger,
    buttons: {
      snap,
      start,
      stop,
      pip,
    },
  });
}

export { Camera, makeCamera };
