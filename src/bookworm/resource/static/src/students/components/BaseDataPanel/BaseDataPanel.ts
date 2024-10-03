interface StudentData {
  name: string;
  bill: number;
  eBookLicense: number;
  fee: number;
  grade: number;
  classAddition: string;
  isGem: boolean;
};

class BaseDataPanel implements Component {
  private studentData: StudentData = {
    name: "",
    bill: 0,
    eBookLicense: 0,
    fee: 0,
    grade: 0,
    classAddition: "",
    isGem: false
  };

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["baseDataPanel"],
      children: [
        new LeftBaseDataPanel((val: string) => this.setName(val), (val: string) => this.setBill(val), (val: string) => this.setEBookLicense(val)).instructions(),
        new MiddleBaseDataPanel().instructions(),
        new RightBaseDataPanel().instructions(),
      ]
    };
  }

  private setName(val: string) {
    this.studentData = {
        ...this.studentData,
        name: val
    };
    console.log(this.studentData);
  }

  private setBill(val: string) {
    this.studentData = {
      ...this.studentData,
      bill: parseFloat(val)
    };
    console.log(this.studentData);
  }

  private setEBookLicense(val: string) {
    this.studentData = {
      ...this.studentData,
      eBookLicense: parseFloat(val)
    };
    console.log(this.studentData);
  }

  public unload() {}
}
