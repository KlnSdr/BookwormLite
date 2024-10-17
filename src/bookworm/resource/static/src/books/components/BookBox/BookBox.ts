class BookBox implements Component {
  private readonly data: Book;
  private readonly demandBorrowId: string = Math.random().toString(36);
  private readonly demandBuyId: string = Math.random().toString(36);

  constructor(data: Book) {
    this.data = data;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => this.loadAndDisplayDemand(), 10);

    return {
      tag: "div",
      classes: ["bookBox"],
      children: [
        {
          tag: "h2",
          text: "Name: " + this.data.name,
        },
        {
          tag: "label",
          text: "Klassenstufe: " + this.data.grades.join(", "),
        },
        {
          tag: "label",
          text: "Preis: " + this.data.price + "€",
        },
        {
          tag: "label",
          text: "LG berechnen: " + (this.data.applyFee ? "Ja" : "Nein"),
        },
        {
          tag: "label",
          text: "Bestand: " + this.data.stock,
        },
        {
          tag: "label",
          text: "Bedarf (leih): ???",
          id: this.demandBorrowId,
        },
        {
          tag: "label",
          text: "Bedarf (kauf): ???",
          id: this.demandBuyId,
        },
      ],
    };
  }

  private loadAndDisplayDemand() {
    fetch(`{{CONTEXT}}/rest/books/id/${this.data.id}/demand`)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then((data: { demandBorrow: number; demandBuy: number }) =>
        this.updateDemandLabels(
          data.demandBorrow.toString(),
          data.demandBuy.toString(),
        ),
      )
      .catch((reason) => {
        console.error("Error fetching demand data: ", reason);
        this.updateDemandLabels("Fehler", "Fehler");
      });
  }

  private updateDemandLabels(demandBorrow: string, demandBuy: string) {
    const demandBorrowLabel: edomElement | undefined = edom.findById(
      this.demandBorrowId,
    );
    const demandBuyLabel: edomElement | undefined = edom.findById(
      this.demandBuyId,
    );

    if (demandBorrowLabel) {
      demandBorrowLabel.text = "Bedarf (leih): " + demandBorrow;
    }

    if (demandBuyLabel) {
      demandBuyLabel.text = "Bedarf (kauf): " + demandBuy;
    }
  }

  public unload() {}
}
