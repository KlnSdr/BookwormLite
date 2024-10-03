class LeftBaseDataPanel implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        new LabeledInput("Name:").instructions(),
        new LabeledInput("Rechnung (€):").instructions(),
        new LabeledInput("E-Booklizenz (€):").instructions(),
      ]
    };
  }

  public unload() {}
}
