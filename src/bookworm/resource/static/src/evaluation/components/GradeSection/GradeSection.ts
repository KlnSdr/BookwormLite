class GradeSection implements Component {
  private readonly grade: string;
  private readonly isGem: boolean;

  constructor(grade: string, isGem: boolean) {
    this.grade = grade;
    this.isGem = isGem;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "details",
      children: [
        {
          tag: "summary",
          text: `Klasse ${this.grade}`,
        },
        {
          tag: "div",
          classes: ["gradeSection"],
          children: [
            new FinancialBaseDataPanel(this.grade, this.isGem).instructions(),
            new StudentSection(this.grade, this.isGem).instructions(),
            new BookSection(this.grade, this.isGem).instructions(),
          ],
        },
      ],
    };
  }

  public unload() {}
}
