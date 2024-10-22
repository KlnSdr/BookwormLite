class GradeSection implements Component {
  private readonly grade: string;

  constructor(grade: string) {
    this.grade = grade;
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
      ],
    };
  }

  public unload() {}
}
