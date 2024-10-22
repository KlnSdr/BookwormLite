class FinancialBaseDataPanel implements Component {
  private readonly idNumStudents: string = Math.random().toString(36);
  private readonly idSumBorrow: string = Math.random().toString(36);
  private readonly idSumBuy: string = Math.random().toString(36);
  private readonly idSumEbook: string = Math.random().toString(36);
  private readonly idSumBill: string = Math.random().toString(36);
  private readonly idSumAll: string = Math.random().toString(36);

  private readonly grade: string;
  private readonly isGem: boolean;

  constructor(grade: string, isGem: boolean) {
    this.grade = grade;
    this.isGem = isGem;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    this.loadFinancialDataForGrade()
      .then((data: BaseFinancialData) => this.displayFinancialData(data))
      .catch((reason: any) => console.error(reason));

    return {
      tag: "div",
      children: [
        {
          tag: "p",
          text: "Anzahl Schüler*innen: ???",
          id: this.idNumStudents,
        },
        {
          tag: "p",
          text: "Leihgebühren: ?? €",
          id: this.idSumBorrow,
        },
        {
          tag: "p",
          text: "Kaufgebühren: ?? €",
          id: this.idSumBuy,
        },
        {
          tag: "p",
          text: "E-Booklizenzen: ?? €",
          id: this.idSumEbook,
        },
        {
          tag: "p",
          text: "Rechnungen: ?? €",
          id: this.idSumBill,
        },
        {
          tag: "p",
          classes: ["bold"],
          text: "Gesamtbetrag: ?? €",
          id: this.idSumAll,
        },
      ],
    };
  }

  private displayFinancialData(data: BaseFinancialData) {
    const outNumStudents: edomElement | undefined = edom.findById(
      this.idNumStudents,
    );
    const outSumBorrow: edomElement | undefined = edom.findById(
      this.idSumBorrow,
    );
    const outSumBuy: edomElement | undefined = edom.findById(this.idSumBuy);
    const outSumEbook: edomElement | undefined = edom.findById(this.idSumEbook);
    const outSumBill: edomElement | undefined = edom.findById(this.idSumBill);
    const outSumAll: edomElement | undefined = edom.findById(this.idSumAll);

    if (
      outNumStudents === undefined ||
      outSumBorrow === undefined ||
      outSumBuy === undefined ||
      outSumEbook === undefined ||
      outSumBill === undefined ||
      outSumAll === undefined
    ) {
      return;
    }

    outNumStudents.text = `Anzahl Schüler*innen: ${data.studentCount}`;
    outSumBorrow.text = `Leihgebühren: ${data.borrow.toFixed(2)} €`;
    outSumBuy.text = `Kaufgebühren: ${data.buy.toFixed(2)} €`;
    outSumEbook.text = `E-Booklizenzen: ${data.eBook.toFixed(2)} €`;
    outSumBill.text = `Rechnungen: ${data.bill.toFixed(2)} €`;
    outSumAll.text = `Gesamtbetrag: ${(
      data.borrow +
      data.buy +
      data.eBook +
      data.bill
    ).toFixed(2)} €`;
  }

  private loadFinancialDataForGrade(): Promise<BaseFinancialData> {
    return new Promise((resolve, reject) => {
      fetch(
        `{{CONTEXT}}/rest/evaluation/${this.isGem ? "gem" : "gym"}/grade/${this.grade}/financial-data`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
          }
          return response.json();
        })
        .then((data: BaseFinancialData) => {
          resolve(data);
        })
        .catch((reason: any) => {
          reject(reason);
        });
    });
  }

  public unload() {}
}
