class RadiobuttonGroup implements Component {
  private readonly options: string[];
  private readonly groupName: string = Math.random().toString(36);
  private readonly onChange: (option: string) => void;
  private readonly presetIndex: number;
  public constructor(options: string[], onChange: (option: string) => void = () => {}, presetIndex: number = -1) {
    this.options = options;
    this.onChange = onChange;
    this.presetIndex = presetIndex;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: this.options.map((option: string, index: number) => new Radiobutton(
          option,
          this.groupName,
          () => this.onChange(option),
          index === this.presetIndex
      ).instructions())
    };
  }

  public unload() {}
}
