class BookRow implements Component {
  private readonly book: EvaluationBookData;

  constructor(book: EvaluationBookData) {
    this.book = book;
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
          text: this.book.name,
        },
        {
          tag: "td",
          text: `${this.book.buyCount} (${this.book.sumPriceBuy.toFixed(2)} €)`,
        },
        {
          tag: "td",
          text: `${this.book.borrowCount} (${this.book.sumPriceBorrow.toFixed(2)} €)`,
        },
      ],
    };
  }

  public unload() {}
}
