class MiddleBaseDataPanel implements Component {
  private static readonly GRADES = ["5", "6", "7", "8", "9", "10", "11", "12"];
  private static readonly CLASS_ADDITIONS = ["a", "b", "c", "d", "e"];
  private static readonly FEES = ["1", "2", "3"];

  private readonly setFee: (val: string) => void;
  private readonly setGrade: (val: string) => void;
  private readonly setClassAddition: (val: string) => void;
  private readonly setIsGem: (val: boolean) => void;
  private readonly getStudentData: () => StudentData;
  public constructor(
    setFee: (val: string) => void,
    setGrade: (val: string) => void,
    setClassAddition: (val: string) => void,
    setIsGem: (val: boolean) => void,
    getStudentData: () => StudentData,
  ) {
    this.setFee = setFee;
    this.setGrade = setGrade;
    this.setClassAddition = setClassAddition;
    this.setIsGem = setIsGem;
    this.getStudentData = getStudentData;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        new LabeledDropdown(
          "Leihgebühr (€):",
          this.setFee,
          MiddleBaseDataPanel.FEES,
          this.getStudentData().fee.toString(),
        ).instructions(),
        new LabeledDropdown(
          "Klassenstufe:",
          this.setGrade,
          MiddleBaseDataPanel.GRADES,
          this.getStudentData().grade.toString(),
        ).instructions(),
        new LabeledDropdown(
          "Klassenzusatz:",
          this.setClassAddition,
          MiddleBaseDataPanel.CLASS_ADDITIONS,
          this.getStudentData().classAddition,
        ).instructions(),
        new Checkbox(
          "Gemeinschaftsschule: ",
          this.setIsGem,
          this.getStudentData().isGem,
        ).instructions(),
      ],
    };
  }

  public unload() {}
}
