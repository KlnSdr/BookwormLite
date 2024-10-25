class StudentRow implements Component {
  private readonly data: EvaluationStudentData;
  private readonly allBooks: string[];

  constructor(data: EvaluationStudentData, allBooks: string[]) {
    this.data = data;
    this.allBooks = allBooks;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "tr",
      children: [
        {
          tag: "td",
          text: this.data.name,
        },
        {
          tag: "td",
          text: this.data.classAddition,
        },
        {
          tag: "td",
          text: this.data.sumBuy.toFixed(2) + " €",
        },
        {
          tag: "td",
          text: this.data.sumBorrow.toFixed(2) + " €",
        },
        {
          tag: "td",
          text: this.data.eBook.toFixed(2) + " €",
        },
        {
          tag: "td",
          text: this.data.bill.toFixed(2) + " €",
        },
        ...this.allBooks.map((bookName: string) => {
          const book: EvaluationStudentBook = this.data.books.find(
            (b: EvaluationStudentBook) => b.name === bookName,
          ) ?? { name: "", type: "" };
          return {
            tag: "td",
            text: StudentRow.usageTypeToShort(book.type),
          };
        }),
        {
          tag: "td",
          text:
            (
              this.data.sumBuy +
              this.data.sumBorrow +
              this.data.eBook +
              this.data.bill
            ).toFixed(2) + " €",
        },
      ],
    };
  }

  private static usageTypeToShort(usageType: string): string {
    switch (usageType) {
      case "BUY":
        return "K";
      case "BORROW":
        return "L";
      case "NOT_NEEDED":
        return "N.B.";
      case "ALREADY_OWNED":
        return "N.B.";
      default:
        return "";
    }
  }

  public unload() {}
}
