class LeftBaseDataPanel implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        new LabeledDropdown("Klassestufe:").instructions(),
        new LabeledDropdown("Klassenzusatz:").instructions(),
        new Checkbox("Gemeinschaftsschule: ").instructions(),
        new LabeledInput("Name:").instructions(),
        new LabeledInput("Rechnung (€):").instructions(),
        new LabeledInput("E-Booklizenz (€):").instructions(),
        new LabeledDropdown("Leihgebühr (€):").instructions(),
      ]
    };
  }

  public unload() {}
}
