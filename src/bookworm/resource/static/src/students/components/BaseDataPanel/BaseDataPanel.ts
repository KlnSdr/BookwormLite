class BaseDataPanel implements Component {
    private readonly setName: (val: string) => void;
    private readonly setBill: (val: string) => void;
    private readonly setEBookLicense: (val: string) => void;
    private readonly setFee: (val: string) => void;
    private readonly setGrade: (val: string) => void;
    private readonly setClassAddition: (val: string) => void;
    private readonly setIsGem: (val: boolean) => void;
    private readonly getStudentData: () => StudentData;
    public constructor(
        setName: (val: string) => void,
        setBill: (val: string) => void,
        setEBookLicense: (val: string) => void,
        setFee: (val: string) => void,
        setGrade: (val: string) => void,
        setClassAddition: (val: string) => void,
        setIsGem: (val: boolean) => void,
        getStudentData: () => StudentData
    ) {
        this.setName = setName;
        this.setBill = setBill;
        this.setEBookLicense = setEBookLicense;
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
      classes: ["baseDataPanel"],
      children: [
        new LeftBaseDataPanel(this.setName, this.setBill, this.setEBookLicense).instructions(),
        new MiddleBaseDataPanel(
            this.setFee,
            this.setGrade,
            this.setClassAddition,
            this.setIsGem
        ).instructions(),
        new RightBaseDataPanel(() => this.getStudentData()).instructions(),
      ]
    };
  }
  public unload() {}
}
