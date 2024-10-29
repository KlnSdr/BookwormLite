class GradeSection implements Component {
  private readonly grade: string;
  private readonly isGem: boolean;
  private readonly idSummary: string = Math.random().toString(36);

  private loadingData: { money: boolean; students: boolean; books: boolean } = {
    money: true,
    students: true,
    books: true,
  };

  constructor(grade: string, isGem: boolean) {
    this.grade = grade;
    this.isGem = isGem;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // setTimeout(() => this.updateSummary(), 10);

    const financePanel: FinancialBaseDataPanel = new FinancialBaseDataPanel(
      this.grade,
      this.isGem,
      () => {
        this.loadingData.money = false;
        this.updateSummary();
      },
    );
    const studentSection: StudentSection = new StudentSection(
      this.grade,
      this.isGem,
      () => {
        this.loadingData.students = false;
        this.updateSummary();
      },
    );
    const bookSection: BookSection = new BookSection(
      this.grade,
      this.isGem,
      () => {
        this.loadingData.books = false;
        this.updateSummary();
      },
    );

    return {
      tag: "details",
      handler: [
        {
          id: "click",
          type: "click",
          body: (self: edomElement) => {
            financePanel.populateData();
          },
        },
      ],
      children: [
        {
          tag: "summary",
          text: `Klasse ${this.grade}`,
          id: this.idSummary,
        },
        {
          tag: "div",
          classes: ["gradeSection"],
          children: [
            financePanel.instructions(),
            studentSection.instructions(),
            bookSection.instructions(),
          ],
        },
      ],
    };
  }

  private updateSummary() {
    const summary: edomElement | undefined = edom.findById(this.idSummary);

    if (!summary) {
      return;
    }

    if (
      this.loadingData.money ||
      this.loadingData.students ||
      this.loadingData.books
    ) {
      summary.text = `Klasse ${this.grade} (${this.loadingData.money ? "Finanzen: 🔄" : ""} ${this.loadingData.students ? "Schüler*innen: 🔄" : ""} ${this.loadingData.books ? "Bücher: 🔄" : ""})`;
    } else {
      summary.text = `Klasse ${this.grade}`;
    }
  }

  public unload() {}
}
