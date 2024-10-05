class MiddleBaseDataPanel implements Component {
  private static readonly GRADES = ["5", "6", "7", "8", "9", "10", "11", "12"];
  private static readonly CLASS_ADDITIONS = ["a", "b", "c", "d", "e"];
  private static readonly FEES = ["1", "2", "3"];

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
        new LabeledDropdown("Leihgebühr (€):", this.setFee, MiddleBaseDataPanel.FEES).instructions(),
        new LabeledDropdown("Klassestufe:", this.setGrade, MiddleBaseDataPanel.GRADES).instructions(),
        new LabeledDropdown("Klassenzusatz:", this.setClassAddition, MiddleBaseDataPanel.CLASS_ADDITIONS).instructions(),
        new Checkbox("Gemeinschaftsschule: ", this.setIsGem).instructions(),
      ]
    };
  }

  public unload() {}
}
