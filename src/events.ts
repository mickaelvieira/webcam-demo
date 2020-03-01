/* eslint @typescript-eslint/no-explicit-any: off */

interface Events {
  [eventName: string]: Listener[];
}

type Listener = (...args: any[]) => void;

export default class EventEmitter {
  events: Events = {};

  on(event: string, listener: Listener) {
    if (!Array.isArray(this.events[event])) {
      this.events[event] = [];
    }
    this.events[event].push(listener);

    return () => {
      return this.off(event, listener);
    };
  }

  off(event: string, listener: Listener) {
    if (Array.isArray(this.events[event])) {
      const idx = this.events[event].indexOf(listener);
      if (idx >= 0) {
        this.events[event].splice(idx, 1);
      }
    }
  }

  emit(event: string, ...args: any[]) {
    if (Array.isArray(this.events[event])) {
      this.events[event].forEach(listener => {
        listener(...args);
      });
    }
  }

  once(event: string, listener: Listener) {
    const callback: Listener = (...args) => {
      this.off(event, callback);
      listener(...args);
    };
    this.on(event, callback);
  }
}
