class BookBox implements Component {
  private readonly title: string;
  private readonly onChange: (option: BookUsageType) => void;
  public constructor(title: string, onChange: (option: BookUsageType) => void = () => {}) {
    this.title = title;
    this.onChange = onChange;
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
        new RadiobuttonGroup(["kaufen", "leihen", "vorhanden", "nicht benötigt"], (val: string) => this.onChange(bookUsageTypeFromString(val))).instructions()
      ]
    };
  }

  public unload() {}
}
