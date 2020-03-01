export default class Message {
  element: HTMLDivElement;

  cssError = "error";
  cssInfo = "info";
  allCss = [this.cssError, this.cssInfo];

  constructor(element: HTMLDivElement) {
    this.element = element;
  }

  clear() {
    this.element.classList.remove(...this.allCss);
    this.element.innerHTML = "";
  }

  info(message: string) {
    this.clear();
    this.element.classList.add(this.cssInfo);
    this.update(message);
  }

  error(message: string) {
    this.clear();
    this.element.classList.add(this.cssError);
    this.update(message);
  }

  update(message: string) {
    this.element.innerHTML = message;
  }
}
