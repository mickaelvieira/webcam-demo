/* eslint @typescript-eslint/no-explicit-any: off */

interface Events {
  [eventName: string]: Listener[];
}

type Listener = (...args: any[]) => void;

type Unsubscribe = () => void;

export class EventEmitter {
  events: Events = {};

  on(event: string, listener: Listener): Unsubscribe {
    if (!Array.isArray(this.events[event])) {
      this.events[event] = [];
    }
    this.events[event].push(listener);

    return (): void => {
      this.off(event, listener);
    };
  }

  off(event: string, listener: Listener): void {
    if (Array.isArray(this.events[event])) {
      const idx = this.events[event].indexOf(listener);
      if (idx >= 0) {
        this.events[event].splice(idx, 1);
      }
    }
  }

  emit(event: string, ...args: any[]): void {
    if (Array.isArray(this.events[event])) {
      this.events[event].forEach(listener => {
        listener(...args);
      });
    }
  }

  once(event: string, listener: Listener): void {
    const callback: Listener = (...args) => {
      this.off(event, callback);
      listener(...args);
    };
    this.on(event, callback);
  }
}

/* eslint @typescript-eslint/no-empty-interface: off */

interface Message {}

type Subscriber = (message: any) => void;

interface Subscribers {
  [name: string]: Subscriber[];
}

export class PubSub {
  subscribers: Subscribers = {};

  subscribe(topic: string, handler: Subscriber): void {
    if (!Array.isArray(this.subscribers[topic])) {
      this.subscribers[topic] = [];
    }
    this.subscribers[topic].push(handler);
  }

  unsubscribe(handler: Subscriber): void {
    for (const subscribers of Object.values(this.subscribers)) {
      const idx = subscribers.indexOf(handler);
      if (idx >= 0) {
        subscribers.splice(idx, 1);
      }
    }
  }

  dispatch(topic: string, message: any): void {
    if (Array.isArray(this.subscribers[topic])) {
      this.subscribers[topic].forEach(handler => {
        handler(message);
      });
    }
  }
}
