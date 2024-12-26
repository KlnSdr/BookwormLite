class LoadBackupPopup implements Component {
  public static show() {
    new LoadBackupPopup().render(edom.body);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore imported from students project
    return new Popup(
      "Daten importieren",
      new LoadBackup().instructions(),
    ).instructions();
  }

  public unload() {}
}
