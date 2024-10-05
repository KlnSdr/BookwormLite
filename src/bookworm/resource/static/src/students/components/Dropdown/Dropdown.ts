class Dropdown implements Component {
    private readonly onInput: (val: string) => void;
    public constructor(onInput: (val: string) => void = () => {}) {
        this.onInput = onInput;
    }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "select",
          classes: ["select"],
      handler: [
        {
          id: "onChange",
          type: "change",
          body: (self: edomElement) => {
            this.onInput((self.element as HTMLSelectElement).value);
          }
        }
      ],
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
  }

  public unload() {}
}
