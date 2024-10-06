class ContainerBooks implements Component {
  private readonly updateBooks: (book: string, option: BookUsageType) => void;
  public constructor(updateBooks: (book: string, option: BookUsageType) => void = () => {}) {
    this.updateBooks = updateBooks;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
        classes: ["containerBooks"],
      children: ["Hausaufgabenheft", "Chemie - Heute", "Elemente der Mathematik 5"]
          .map((book: string) => new BookBox(
              book,
              (option: BookUsageType) => {
                this.updateBooks(book, option);
              }
          ).instructions())
    };
  }

  public unload() {}
}
