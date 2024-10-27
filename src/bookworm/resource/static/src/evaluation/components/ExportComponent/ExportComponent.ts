class ExportComponent implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        {
          tag: "p",
          text: "Exportieren als:",
        },
        {
          tag: "div",
          classes: ["exportButtons"],
          children: [
            // @ts-ignore included from students project
            new Button("Excel", () => {}).instructions(),
            // @ts-ignore included from students project
            new Button("Pdf", () => {}).instructions(),
          ],
        },
      ],
    };
  }

  public unload() {}
}
