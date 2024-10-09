class ContainerBooks implements Component {
  private readonly updateBooks: (book: string, option: BookUsageType) => void;
  private readonly books: Book[];
  public constructor(
    books: Book[],
    updateBooks: (book: string, option: BookUsageType) => void = () => {},
  ) {
    this.updateBooks = updateBooks;
    this.books = books;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["containerBooks"],
      children: this.books.map((book: Book) =>
        new BookBox(book.name, (option: BookUsageType) => {
          this.updateBooks(book.id, option);
        }).instructions(),
      ),
    };
  }

  public unload() {}
}
