class BookGradeSection implements Component {
  private readonly grade: number;
  private readonly books: Book[];
  private stockWarningCount: number = 0;
  private readonly stockWarningId: string = Math.random().toString(36);

  constructor(grade: number, books: Book[]) {
    this.grade = grade;
    this.books = books;
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
          id: this.stockWarningId,
        },
        {
          tag: "div",
          classes: ["bookGradeSection"],
          children: this.books.map((book) =>
            new BookBox(book, () => this.onStockWarning()).instructions(),
          ),
        },
      ],
    };
  }

  private onStockWarning() {
    this.stockWarningCount++;

    if (this.stockWarningCount <= 0) {
      return;
    }

    const warningElement: edomElement | undefined = edom.findById(
      this.stockWarningId,
    );

    if (warningElement) {
      warningElement.text = `Klasse ${this.grade} (${this.stockWarningCount} Warnungen)`;
    }
  }

  public unload() {}
}
