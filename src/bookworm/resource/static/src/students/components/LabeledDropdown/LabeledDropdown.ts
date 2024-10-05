class LabeledDropdown implements Component {
  private readonly labelText: string;
  private readonly onInput: (val: string) => void;
    public constructor(labelText: string, onInput: (val: string) => void = () => {}) {
        this.labelText = labelText;
        this.onInput = onInput;
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
          new Dropdown(this.onInput).instructions()
        ]
    };
  }

  public unload() {}
}
