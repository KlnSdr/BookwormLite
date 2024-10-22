class EvaluationPanel implements Component {
  private readonly schoolType: string;
  private readonly isGem: boolean;
  private readonly grades: string[];

  constructor(schoolType: string, isGem: boolean, grades: string[] = []) {
    this.schoolType = schoolType;
    this.isGem = isGem;
    this.grades = grades;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        {
          tag: "h1",
          text: this.schoolType,
        },
        ...this.grades.map((grade: string) =>
          new GradeSection(grade, this.isGem).instructions(),
        ),
      ],
    };
  }

  public unload() {}
}
