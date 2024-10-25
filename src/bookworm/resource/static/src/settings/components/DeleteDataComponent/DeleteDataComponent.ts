class DeleteDataComponent implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        {
          tag: "p",
          text: "Die folgenden Daten werden gelöscht:",
        },
        {
          tag: "ul",
          children: [
            "Schüler*innen",
            "Bücher",
            "Schüler*in - Buch - Zuordnungen",
          ].map((item: string) => {
            return {
              tag: "li",
              text: item,
            };
          }),
        },
        {
          tag: "div",
          classes: ["centerButtons"],
          children: [
            // @ts-ignore imported from students project
            new Button(
              "ja, Daten löschen",
              (self: edomElement) => {
                this.doDelete(self);
              },
              ["dangerButton"],
            ).instructions(),
            // @ts-ignore imported from students project
            new Button("abbrechen", (self: edomElement) => {
              // @ts-ignore imported from students project
              Popup.close(self);
            }).instructions(),
          ],
        },
      ],
    };
  }

  private doDelete(eventTarget: edomElement) {
    eventTarget.text = "Löschen...";
    fetch(`{{CONTEXT}}/rest/settings/all-data`, {
      method: "DELETE",
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("Fehler beim Löschen der Daten!");
        }
        // @ts-ignore imported from students project
        Popup.close(eventTarget);
        // @ts-ignore imported from students project
        Alert.show("Daten gelöscht!");
      })
      .catch((error: Error) => {
        console.error(error);
        // @ts-ignore imported from students project
        Popup.close(eventTarget);
        // @ts-ignore imported from students project
        Alert.show("Fehler beim Löschen der Daten!");
      });
  }

  public unload() {}
}
