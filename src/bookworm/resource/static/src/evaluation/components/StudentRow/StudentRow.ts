class StudentRow implements Component {
  private readonly data: EvaluationStudentData;

  constructor(data: EvaluationStudentData) {
    this.data = data;
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
          text: this.data.sumBuy.toFixed(2) + "€",
        },
        {
          tag: "td",
          text: this.data.sumBorrow.toFixed(2) + "€",
        },
        {
          tag: "td",
          text: this.data.eBook.toFixed(2) + "€",
        },
        {
          tag: "td",
          text: this.data.bill.toFixed(2) + "€",
        },
        {
          tag: "td",
          text:
            (
              this.data.sumBuy +
              this.data.sumBorrow +
              this.data.eBook +
              this.data.bill
            ).toFixed(2) + "€",
        },
      ],
    };
  }

  public unload() {}
}
