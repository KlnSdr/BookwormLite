class StudentsExplorerPopup implements Component {
  public static show() {
    new StudentsExplorerPopup().render(edom.body);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return new Popup(
      "Schüler*in auswählen",
      new StudentsExplorer().instructions(),
    ).instructions();
  }

  public unload() {}
}
