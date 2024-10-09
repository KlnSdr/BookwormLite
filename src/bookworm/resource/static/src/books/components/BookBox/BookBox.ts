class BookBox implements Component {
  private readonly data: Book;
  constructor(data: Book) {
    this.data = data;
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
          tag: "h2",
          text: "Name: " + this.data.name,
        },
        {
          tag: "label",
          text: "Klassenstufe: " + this.data.grades.join(", "),
        },
        {
          tag: "label",
          text: "Preis: " + this.data.price + "€",
        },
        {
          tag: "label",
          text: "LG berechnen: " + (this.data.applyFee ? "Ja" : "Nein"),
        },
        {
          tag: "label",
          text: "Bestand: " + this.data.stock,
        },
      ],
    };
  }

  public unload() {}
}
