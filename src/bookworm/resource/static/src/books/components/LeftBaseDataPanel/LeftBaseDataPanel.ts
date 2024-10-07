class LeftBaseDataPanel implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        // @ts-ignore included from students project
        new LabeledInput("Name:").instructions(),
        // @ts-ignore included from students project
        new LabeledInput("Bestand:").instructions(),
        // @ts-ignore included from students project
        new LabeledInput("Preis (€):").instructions(),
      ]
    };
  }

  public unload() {}
}
