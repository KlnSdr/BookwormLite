class ContainerBooks implements Component {
  private readonly updateBooks: (book: string, option: BookUsageType) => void;
  private readonly books: Book[];
  private readonly bookPresets: StudentBook[];
  public constructor(
    books: Book[],
    updateBooks: (book: string, option: BookUsageType) => void = () => {},
    bookPresets: StudentBook[] = []
  ) {
    this.updateBooks = updateBooks;
    this.books = books;
    this.bookPresets = bookPresets;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["containerBooks"],
      children: this.books.map((book: Book) => {
          const preset: StudentBook | undefined = this.bookPresets.find((preset: StudentBook) => preset.id === book.id);
        return new BookBox(book.name, (option: BookUsageType) => {
          this.updateBooks(book.id, option);
        }, preset ? preset.type : BookUsageType.UNKNOWN).instructions();
      }),
    };
  }

  public unload() {}
}
