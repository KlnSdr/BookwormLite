class FinancialBaseDataPanel implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        {
          tag: "p",
          text: "Anzahl Schüler*innen: ???",
        },
        {
          tag: "p",
          text: "Leihgebühren: ?? €",
        },
        {
          tag: "p",
          text: "Kaufgebühren: ?? €",
        },
        {
          tag: "p",
          text: "E-Booklizenzen: ?? €",
        },
        {
          tag: "p",
          text: "Rechnungen: ?? €",
        },
        {
          tag: "p",
          text: "Gesamtbetrag: ?? €",
        },
      ],
    };
  }

  public unload() {}
}
