class RightBaseDataPanel implements Component {
  private readonly validateBookData: () => boolean;
  private readonly getBookData: () => Book;
  private readonly resetPanel: () => void;

  constructor(validateBookData: () => boolean, getBookData: () => Book, resetPanel: () => void) {
    this.validateBookData = validateBookData;
    this.getBookData = getBookData;
    this.resetPanel = resetPanel;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["rightBaseDataPanel"],
      children: [
        // @ts-ignore included from students project
        new Button("speichern", () => this.doSave(), ["secondaryButton", "smallFlexButton"]).instructions()
      ]
    };
  }

  private doSave() {
    if (!this.validateBookData()) {
      alert("Bitte füllen Sie alle Felder aus.");
      return;
    }

    const bookData = this.getBookData();
    const mappedData = this.map(bookData);

    fetch("{{CONTEXT}}/rest/books", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(mappedData)
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error("HTTP error, status = " + response.status);
      }
      alert("Daten erfolgreich gespeichert.");
      this.resetPanel();
    })
    .catch((reason: any) => {
        console.error(reason);
        alert("Fehler beim Speichern der Daten.");
    });
  }

  // transform bookdata to what the backend expects, because i don't want to change either for now (this is temporary *wink*)
  private map(bookData: Book) {
    return {
      name: bookData.name,
      stock: bookData.stock,
      price: bookData.price,
      grades: bookData.classes,
      forGem: bookData.isGem,
      applyFee: bookData.isCalculateFee
    };
  }

  public unload() {}
}
