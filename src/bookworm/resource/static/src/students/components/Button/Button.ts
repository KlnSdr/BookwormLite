class Button implements Component {
  private readonly text: string;
  private readonly onClick: (self: edomElement) => void;

  public constructor(text: string, onClick: (self: edomElement) => void) {
    this.text = text;
    this.onClick = onClick;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "button",
      text: this.text,
      classes: ["button"],
      handler: [
        {
          id: "click",
          type: "click",
          body: this.onClick
        }
      ]
    };
  }

  public unload() {}
}
