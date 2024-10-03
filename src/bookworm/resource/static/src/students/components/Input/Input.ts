class Input implements Component {
  private readonly onInput: (val: string) => void;
    public constructor(onInput: (val: string) => void = () => {}) {
        this.onInput = onInput;
    }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "input",
      classes: ["input"],
      handler: [
        {
          id: "onChange",
          type: "input",
          body: (self: edomElement) => {
            this.onInput((self as edomInputElement).value);
          }
        }
      ]
    };
  }

  public unload() {}
}
