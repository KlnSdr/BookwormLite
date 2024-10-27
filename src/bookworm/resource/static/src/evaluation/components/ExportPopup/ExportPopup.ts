class ExportPopup implements Component {
  public static show() {
    new ExportPopup().render(edom.body);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore included from students project
    return new Popup(
      "Daten exportieren",
      new ExportComponent().instructions(),
    ).instructions();
  }

  public unload() {}
}
