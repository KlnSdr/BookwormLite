class CenterPanel implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["center50pContainer"],
      children: [
        {
          tag: "h1",
          text: "Einstellungen",
        },
        // @ts-ignore imported from students project
        new Button("Backup erstellen", () => this.doBackup()).instructions(),
        // @ts-ignore imported from students project
        new Button("alle Daten löschen", () => DeleteDataPopup.show(), [
          "dangerButton",
        ]).instructions(),
        // @ts-ignore imported from students project
        new Button("Daten importieren", () => LoadBackupPopup.show()).instructions(),
      ],
    };
  }

  private doBackup() {
    fetch("{{CONTEXT}}/rest/settings/backup")
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("Backup konnte nicht erstellt werden");
        }
        return response.json();
      })
      .then((data: any) => {
        DownloadBackupPopup.show(data);
      })
      .catch((error: Error) => {
        console.error(error);
      });
  }

  public unload() {}
}
