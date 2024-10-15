class BookBox implements Component {
  private readonly title: string;
  private readonly onChange: (option: BookUsageType) => void;
  private readonly preset: BookUsageType;
  public constructor(
    title: string,
    onChange: (option: BookUsageType) => void = () => {},
    preset: BookUsageType
  ) {
    this.title = title;
    this.onChange = onChange;
    this.preset = preset;
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
          text: this.title,
        },
        new RadiobuttonGroup(
          ["kaufen", "leihen", "vorhanden", "nicht benötigt"],
          (val: string) => this.onChange(bookUsageTypeFromString(val)),
          this.usageTypeToRadioIndex(this.preset)
        ).instructions(),
      ],
    };
  }

  private usageTypeToRadioIndex(usageType: BookUsageType) {
    switch (usageType) {
      case BookUsageType.BUY:
        return 0;
      case BookUsageType.BORROW:
        return 1;
      case BookUsageType.ALREADY_OWNED:
        return 2;
      case BookUsageType.NOT_NEEDED:
        return 3;
      default:
        return -1;
    }
  }

  public unload() {}
}
