class EvaluationPanel implements Component {
  private readonly schoolType: string;

  constructor(schoolType: string) {
    this.schoolType = schoolType;
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
        ...["5", "6", "7", "8", "9", "10", "11", "12"].map((grade: string) =>
          new GradeSection(grade).instructions(),
        ),
      ],
    };
  }

  public unload() {}
}
