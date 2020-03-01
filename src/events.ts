/* eslint @typescript-eslint/no-explicit-any: off */

interface Events {
  [eventName: string]: Listener[];
}

type Listener = (...args: any[]) => void;

type Unsubscribe = () => void;

export default class EventEmitter {
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
