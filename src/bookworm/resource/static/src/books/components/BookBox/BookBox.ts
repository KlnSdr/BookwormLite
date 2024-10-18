class BookBox implements Component {
  private readonly data: Book;
  private readonly onStockWarning: () => void;
  private readonly demandBorrowId: string = Math.random().toString(36);
  private readonly demandBuyId: string = Math.random().toString(36);
  private readonly stockId: string = Math.random().toString(36);

  constructor(data: Book, onStockWarning: () => void) {
    this.data = {
      ...data,
      stock: parseInt(data.stock.toString()),
      price: parseFloat(data.price.toString()),
    };
    this.onStockWarning = onStockWarning;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => this.loadAndDisplayDemand(), 10);

    return {
      tag: "div",
      classes: ["bookBox"],
      handler: [
        {
          id: "editBook",
          type: "click",
          body: (self: edomElement) => {
            this.openBook();
          },
        },
      ],
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
          id: this.stockId,
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
      .then((data: { demandBorrow: number; demandBuy: number }) => {
        this.updateDemandLabels(
          data.demandBorrow.toString(),
          data.demandBuy.toString(),
        );
        if (this.data.stock < data.demandBorrow) {
          this.colorStockDanger();
          this.onStockWarning();
        }
      })
      .catch((reason) => {
        console.error("Error fetching demand data: ", reason);
        this.updateDemandLabels("Fehler", "Fehler");
      });
  }

  private colorStockDanger() {
    const stockLabel: edomElement | undefined = edom.findById(this.stockId);
    if (stockLabel) {
      stockLabel.applyStyle("demandExceedsStock");
    }
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

  private openBook() {
    const basePanel: edomElement | undefined = edom.allElements.find(
      (e: edomElement) => e.hasStyle("baseDataPanel"),
    );

    if (!basePanel) {
      console.error("No base panel found");
      return;
    }

    basePanel.delete();

    new BaseDataPanel(this.data).render(
      edom.findById("appContainerBasePanel")!,
    );
  }

  public unload() {}
}
