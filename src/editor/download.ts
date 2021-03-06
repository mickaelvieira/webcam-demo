export default class Download {
  filename = "download.png";

  button: HTMLAnchorElement;

  constructor(button: HTMLAnchorElement) {
    this.button = button;
    this.button.download = this.filename;
  }

  update(data: string): void {
    this.button.href = data;
  }
}
