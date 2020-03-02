export default class Message {
  element: HTMLDivElement;

  cssError = "error";
  cssInfo = "info";
  allCss = [this.cssError, this.cssInfo];

  constructor(element: HTMLDivElement) {
    this.element = element;
  }

  clear(): void {
    this.element.classList.remove(...this.allCss);
    this.element.innerHTML = "";
  }

  info(message: string): void {
    this.clear();
    this.element.classList.add(this.cssInfo);
    this.update(message);
  }

  error(message: string): void {
    this.clear();
    this.element.classList.add(this.cssError);
    this.update(message);
  }

  update(message: string): void {
    this.element.innerHTML = message;
  }
}
