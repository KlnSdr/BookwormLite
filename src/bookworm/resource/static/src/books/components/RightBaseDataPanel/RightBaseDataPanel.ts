class RightBaseDataPanel implements Component {
  private readonly validateBookData: () => boolean;
  private readonly getBookData: () => Book;
  private readonly resetPanel: () => void;

  constructor(
    validateBookData: () => boolean,
    getBookData: () => Book,
    resetPanel: () => void,
  ) {
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
        new Button("speichern", () => this.doSave(), [
          "secondaryButton",
          "smallFlexButton",
        ]).instructions(),
        // @ts-ignore included from students project
        new Button("zurücksetzen", () => this.resetPanel(), [
          "dangerButton",
          "smallFlexButton",
        ]).instructions(),
      ],
    };
  }

  private doSave() {
    if (!this.validateBookData()) {
      // @ts-ignore included from students project
      Alert.show("Bitte füllen Sie alle Felder aus.");
      return;
    }

    const bookData = this.getBookData();

    if (bookData.id === undefined) {
      this.saveNewBook(bookData);
    } else {
      this.updateBook(bookData);
    }
  }

  private updateBook(bookData: Book) {
    fetch(`{{CONTEXT}}/rest/books/id/${bookData.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }
        // @ts-ignore included from students project
        Alert.show("Daten erfolgreich gespeichert.");
        this.resetPanel();
      })
      .catch((reason: any) => {
        console.error(reason);
        // @ts-ignore included from students project
        Alert.show("Fehler beim Speichern der Daten.");
      });
  }

  private saveNewBook(bookData: CreateBook) {
    fetch("{{CONTEXT}}/rest/books", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }
        // @ts-ignore included from students project
        Alert.show("Daten erfolgreich gespeichert.");
        this.resetPanel();
      })
      .catch((reason: any) => {
        console.error(reason);
        // @ts-ignore included from students project
        Alert.show("Fehler beim Speichern der Daten.");
      });
  }

  public unload() {}
}
