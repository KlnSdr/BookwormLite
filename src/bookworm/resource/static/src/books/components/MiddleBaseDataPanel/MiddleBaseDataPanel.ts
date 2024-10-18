class MiddleBaseDataPanel implements Component {
  private static readonly GRADES = ["5", "6", "7", "8", "9", "10", "11", "12"];
  private readonly setLowerClassLimit: (val: number) => void;
  private readonly setUpperclassLimit: (val: number) => void;
  private readonly setIsGem: (val: boolean) => void;
  private readonly setIsCalculateFee: (val: boolean) => void;
  private readonly getBookData: () => Book;

  constructor(
    setLowerClassLimit: (val: number) => void,
    setUpperclassLimit: (val: number) => void,
    setIsGem: (val: boolean) => void,
    setIsCalculateFee: (val: boolean) => void,
    getBookData: () => Book,
  ) {
    this.setLowerClassLimit = setLowerClassLimit;
    this.setUpperclassLimit = setUpperclassLimit;
    this.setIsGem = setIsGem;
    this.setIsCalculateFee = setIsCalculateFee;
    this.getBookData = getBookData;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        // @ts-ignore included from students project
        new LabeledDropdown(
          "Klassenstufe von:",
          (val: string) => this.setLowerClassLimit(parseInt(val)),
          MiddleBaseDataPanel.GRADES,
          this.getBookData().grades.length > 0
            ? this.getBookData().grades[0].toString()
            : "",
        ).instructions(),
        // @ts-ignore included from students project
        new LabeledDropdown(
          "Klassenstufe bis:",
          (val: string) => this.setUpperclassLimit(parseInt(val)),
          MiddleBaseDataPanel.GRADES,
          this.getBookData().grades.length > 0
            ? this.getBookData().grades[
                this.getBookData().grades.length - 1
              ].toString()
            : "",
        ).instructions(),
        // @ts-ignore included from students project
        new Checkbox(
          "Gemeinschaftsschule:",
          this.setIsGem,
          this.getBookData().forGem,
        ).instructions(),
        // @ts-ignore included from students project
        new Checkbox(
          "Leihgebühr berechnen:",
          this.setIsCalculateFee,
          this.getBookData().applyFee,
        ).instructions(),
      ],
    };
  }

  public unload() {}
}
