/* eslint @typescript-eslint/no-explicit-any: off */

type Subscriber = (message: any) => void;

interface Subscribers {
  [name: string]: Subscriber[];
}

export class Channel {
  subscribers: Subscribers = {};

  subscribe(eventName: string, subscriber: Subscriber): void {
    if (!Array.isArray(this.subscribers[eventName])) {
      this.subscribers[eventName] = [];
    }
    this.subscribers[eventName].push(subscriber);
  }

  unsubscribe(subscriber: Subscriber): void {
    for (const subscribers of Object.values(this.subscribers)) {
      const idx = subscribers.indexOf(subscriber);
      if (idx >= 0) {
        subscribers.splice(idx, 1);
      }
    }
  }

  dispatch(
    eventName: string,
    message: HTMLCanvasElement | HTMLImageElement
  ): void {
    if (Array.isArray(this.subscribers[eventName])) {
      this.subscribers[eventName].forEach((subscriber) => {
        subscriber(message);
      });
    }
  }
}
