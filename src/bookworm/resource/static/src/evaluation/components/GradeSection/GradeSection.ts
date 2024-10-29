class GradeSection implements Component {
  private readonly grade: string;
  private readonly isGem: boolean;
  private readonly idSummary: string = Math.random().toString(36);

  private loadingData: { money: boolean; students: boolean; books: boolean } = {
    money: false,
    students: false,
    books: false,
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
        this.loadingData.money = true;
        this.updateSummary();
      },
      () => {
        this.loadingData.money = false;
        this.updateSummary();
      },
    );
    const studentSection: StudentSection = new StudentSection(
      this.grade,
      this.isGem,
      () => {
        this.loadingData.students = true;
        this.updateSummary();
      },
      () => {
        this.loadingData.students = false;
        this.updateSummary();
      },
    );
    const bookSection: BookSection = new BookSection(
      this.grade,
      this.isGem,
      () => {
        this.loadingData.books = true;
        this.updateSummary();
      },
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
      const loading: string[] = [];
      if (this.loadingData.money) {
        loading.push("Finanzen: 🔄");
      }

      if (this.loadingData.students) {
        loading.push("Schüler*innen: 🔄");
      }

      if (this.loadingData.books) {
        loading.push("Bücher: 🔄");
      }

      summary.text = `Klasse ${this.grade} (${loading.join(", ")})`;
    } else {
      summary.text = `Klasse ${this.grade}`;
    }
  }

  public unload() {}
}
