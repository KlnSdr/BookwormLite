class RadiobuttonGroup implements Component {
  private readonly options: string[];
  private readonly groupName: string = Math.random().toString(36);
  public constructor(options: string[]) {
    this.options = options;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: this.options.map((option: string) => new Radiobutton(option, this.groupName).instructions())
    };
  }

  public unload() {}
}
