class LeftBaseDataPanel implements Component {
  private readonly setName: (val: string) => void;
  private readonly setBill: (val: string) => void;
  private readonly setEBookLicense: (val: string) => void;
  public constructor(setName: (val: string) => void, setBill: (val: string) => void, setEBookLicense: (val: string) => void) {
    this.setName = setName;
    this.setBill = setBill;
    this.setEBookLicense = setEBookLicense;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        new LabeledInput("Name:", this.setName).instructions(),
        new LabeledInput("Rechnung (€):", this.setBill).instructions(),
        new LabeledInput("E-Booklizenz (€):", this.setEBookLicense).instructions(),
      ]
    };
  }

  public unload() {}
}
