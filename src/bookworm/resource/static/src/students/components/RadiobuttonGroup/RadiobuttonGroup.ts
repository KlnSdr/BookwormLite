class RadiobuttonGroup implements Component {
  private readonly options: string[];
  private readonly groupName: string = Math.random().toString(36);
  private readonly onChange: (option: string) => void;
  public constructor(options: string[], onChange: (option: string) => void = () => {}) {
    this.options = options;
    this.onChange = onChange;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: this.options.map((option: string) => new Radiobutton(
          option,
          this.groupName,
          () => this.onChange(option)
      ).instructions())
    };
  }

  public unload() {}
}
