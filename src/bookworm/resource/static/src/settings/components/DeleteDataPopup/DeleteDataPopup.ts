class DeleteDataPopup implements Component {
  public static show() {
    new DeleteDataPopup().render(edom.body);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore imported from students project
    return new Popup(
      "Warnung Datenverlust!",
      new DeleteDataComponent().instructions(),
    ).instructions();
  }

  public unload() {}
}
