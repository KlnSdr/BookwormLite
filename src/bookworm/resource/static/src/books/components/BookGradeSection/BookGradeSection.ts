class BookGradeSection implements Component {
  private readonly grade: number;
  private readonly books: Book[];

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
        },
        {
          tag: "div",
          classes: ["bookGradeSection"],
          children: this.books.map((book) => new BookBox(book).instructions()),
        },
      ],
    };
  }

  public unload() {}
}
