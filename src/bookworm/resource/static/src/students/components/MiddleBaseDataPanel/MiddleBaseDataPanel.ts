class MiddleBaseDataPanel implements Component {
  private readonly setFee: (val: string) => void;
  private readonly setGrade: (val: string) => void;
  private readonly setClassAddition: (val: string) => void;
  private readonly setIsGem: (val: boolean) => void;
  public constructor(
    setFee: (val: string) => void,
    setGrade: (val: string) => void,
    setClassAddition: (val: string) => void,
    setIsGem: (val: boolean) => void
  ) {
    this.setFee = setFee;
    this.setGrade = setGrade;
    this.setClassAddition = setClassAddition;
    this.setIsGem = setIsGem;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        new LabeledDropdown("Leihgebühr (€):", this.setFee).instructions(),
        new LabeledDropdown("Klassestufe:", this.setGrade).instructions(),
        new LabeledDropdown("Klassenzusatz:", this.setClassAddition).instructions(),
        new Checkbox("Gemeinschaftsschule: ").instructions(),
      ]
    };
  }

  public unload() {}
}
