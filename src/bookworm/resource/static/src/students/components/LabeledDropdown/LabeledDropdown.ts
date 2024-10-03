class LabeledDropdown implements Component {
  private readonly labelText: string;
    public constructor(labelText: string) {
        this.labelText = labelText;
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
          {
            tag: "select",
            classes: ["select"],
            children: [
              {
                tag: "option",
                text: "Option 1",
                classes: ["option"]
              },
              {
                tag: "option",
                text: "Option 2",
                classes: ["option"]
              }
            ]
          }
        ]
    };
  }

  public unload() {}
}
