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
        new Button("alle Daten löschen", () => DeleteDataPopup.show(), [
          "dangerButton",
        ]).instructions(),
      ],
    };
  }

  public unload() {}
}
