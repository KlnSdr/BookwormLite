class LabeledDropdown implements Component {
  private readonly labelText: string;
  private readonly onInput: (val: string) => void;
  private readonly options: string[];
    public constructor(labelText: string, onInput: (val: string) => void = () => {}, options: string[] = []) {
        this.labelText = labelText;
        this.onInput = onInput;
        this.options = options;
    }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
        classes: ["labeledDropdown"],
        children: [
          {
            tag: "label",
            text: this.labelText,
            classes: ["label"]
          },
          new Dropdown(this.onInput, this.options).instructions()
        ]
    };
  }

  public unload() {}
}
