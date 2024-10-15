class LeftBaseDataPanel implements Component {
  private readonly setName: (val: string) => void;
  private readonly setBill: (val: string) => void;
  private readonly setEBookLicense: (val: string) => void;
  private readonly getStudentData: () => StudentData;
  public constructor(
    setName: (val: string) => void,
    setBill: (val: string) => void,
    setEBookLicense: (val: string) => void,
    getStudentData: () => StudentData,
  ) {
    this.setName = setName;
    this.setBill = setBill;
    this.setEBookLicense = setEBookLicense;
    this.getStudentData = getStudentData;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        new LabeledInput(
          "Name:",
          this.setName,
          this.getStudentData().name,
        ).instructions(),
        new LabeledInput(
          "Rechnung (€):",
          this.setBill,
          this.getStudentData().bill.toString(),
        ).instructions(),
        new LabeledInput(
          "E-Booklizenz (€):",
          this.setEBookLicense,
          this.getStudentData().eBookLicense.toString(),
        ).instructions(),
      ],
    };
  }

  public unload() {}
}
