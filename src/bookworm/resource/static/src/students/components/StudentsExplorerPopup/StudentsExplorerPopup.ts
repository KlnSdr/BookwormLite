class StudentsExplorerPopup implements Component {
  public static show() {
    new StudentsExplorerPopup().render(edom.body);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return new Popup("Schüler*in auswählen", {
      tag: "p",
      text: "Hello World!",
    }).instructions();
  }

  public unload() {}
}
