class BookBox implements Component {
  private readonly title: string;
  public constructor(title: string) {
    this.title = title;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["bookBox"],
      children: [
        {
          tag: "label",
          classes: ["label"],
          text: this.title
        },
        new RadiobuttonGroup(["kaufen", "leihen", "vorhanden", "nicht benötigt"]).instructions()
      ]
    };
  }

  public unload() {}
}
