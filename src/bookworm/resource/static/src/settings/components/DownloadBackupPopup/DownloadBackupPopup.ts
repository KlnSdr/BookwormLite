class DownloadBackupPopup implements Component {
  private readonly data: any;

  constructor(data: any) {
    this.data = data;
  }

  public static show(data: any) {
    new DownloadBackupPopup(data).render(edom.body);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    // @ts-ignore imported from students project
    return new Popup("", {
      tag: "div",
      classes: ["centerButtons"],
      children: [
        // @ts-ignore imported from students project
        new Button("Datei speichern", () => this.doDownload()).instructions(),
      ],
    }).instructions();
  }

  private doDownload() {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(this.data));
    const dlAnchorElem = document.createElement("a");
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "bookwormBackup.json");
    dlAnchorElem.click();
  }

  public unload() {}
}
