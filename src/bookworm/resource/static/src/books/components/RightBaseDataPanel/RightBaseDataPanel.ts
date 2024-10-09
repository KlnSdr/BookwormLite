class RightBaseDataPanel implements Component {
  private readonly validateBookData: () => boolean;
  private readonly getBookData: () => Book;

  constructor(validateBookData: () => boolean, getBookData: () => Book) {
    this.validateBookData = validateBookData;
    this.getBookData = getBookData;
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
    // TODO send bookData to server
    console.log(bookData);
  }

  public unload() {}
}
