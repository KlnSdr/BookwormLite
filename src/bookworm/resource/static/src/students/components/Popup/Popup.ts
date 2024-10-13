class Popup implements Component {
  private readonly body: edomTemplate | null;
  private readonly title: string;

  constructor(title: string, body: edomTemplate | null = null) {
    this.title = title;
    this.body = body;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["popupBackground"],
      children: [
        {
          tag: "div",
          classes: ["popupBody"],
          children: [
            {
              tag: "div",
              classes: ["popupHeader"],
              children: [
                new Button("x", (self: edomElement) =>
                  Popup.close(self),
                ).instructions(),
                {
                  tag: "h1",
                  text: this.title,
                },
              ],
            },
            ...(this.body !== null ? [this.body] : []),
          ],
        },
      ],
    };
  }

  private static close(self: edomElement) {
    if (self.tag.toLowerCase() === "body" || self.parent === undefined) {
      return;
    }

    if (self.parent.classes.includes("popupBackground")) {
      self.parent.delete();
      return;
    }

    Popup.close(self.parent);
  }

  public unload() {}
}
