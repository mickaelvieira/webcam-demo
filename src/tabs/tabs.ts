export default class Tabs {
  tabs: NodeListOf<Element>;
  panels: NodeListOf<Element>;

  constructor() {
    this.tabs = document.querySelectorAll(".tabbutton");
    this.panels = document.querySelectorAll(".tabpanel");
    for (const tab of this.tabs) {
      tab.addEventListener("click", this.handleClick);
    }
    this.change(this.getFirstId());
  }

  handleClick = (event: Event): void => {
    if (event.target) {
      const target = event.currentTarget as Element;
      if (target.id) {
        this.change(target.id);
      }
    }
  };

  change(id: string): void {
    for (const tab of this.tabs) {
      if (tab.id === id) {
        tab.classList.add("active");
      } else {
        tab.classList.remove("active");
      }
    }

    for (const panel of this.panels) {
      if (panel.getAttribute("aria-labelledby") === id) {
        panel.classList.add("active");
      } else {
        panel.classList.remove("active");
      }
    }
  }

  getFirstId(): string {
    return this.tabs.length > 0 ? this.tabs[0].id : "";
  }
}

export function makeTabs(): Tabs {
  return new Tabs();
}
