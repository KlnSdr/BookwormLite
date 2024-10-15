class Checkbox implements Component {
  private readonly labelText: string;
  private readonly onClick: (val: boolean) => void;
  private readonly initialValue: boolean;

  public constructor(
    labelText: string,
    onClick: (val: boolean) => void = () => {},
    initialValue: boolean = false,
  ) {
    this.labelText = labelText;
    this.onClick = onClick;
    this.initialValue = initialValue;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["checkbox"],
      children: [
        {
          tag: "label",
          text: this.labelText,
          classes: ["label"],
        },
        {
          tag: "input",
          classes: ["input"],
          type: "checkbox",
          checked: this.initialValue,
          handler: [
            {
              type: "click",
              id: "onClick",
              body: (self: edomElement) => {
                this.onClick((self.element as HTMLInputElement).checked);
              },
            },
          ],
        },
      ],
    };
  }

  public unload() {}
}
