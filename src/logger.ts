export default class Logger {
  element: Element | null;

  constructor(element: Element | null = null) {
    this.element = element;
  }

  clear() {
    if (this.element) {
      this.element.innerHTML = "";
    }
  }

  log(message: string) {
    console.log(message);
    if (this.element) {
      const div = document.createElement("div");
      div.appendChild(document.createTextNode(message));
      this.element.appendChild(div);
    }
  }
}
