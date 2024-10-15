class LabeledInput implements Component {
  private readonly labelText: string;
  private readonly onInput: (val: string) => void;
  private readonly initialValue: string;
  public constructor(
    labelText: string,
    onInput: (val: string) => void = () => {},
    initialValue: string = "",
  ) {
    this.labelText = labelText;
    this.onInput = onInput;
    this.initialValue = initialValue;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["labeledInput"],
      children: [
        {
          tag: "label",
          text: this.labelText,
          classes: ["label"],
        },
        new Input(this.onInput, this.initialValue).instructions(),
      ],
    };
  }

  public unload() {}
}
