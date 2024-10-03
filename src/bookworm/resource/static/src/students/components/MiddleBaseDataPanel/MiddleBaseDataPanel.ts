class MiddleBaseDataPanel implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        new LabeledDropdown("Leihgebühr (€):").instructions(),
        new LabeledDropdown("Klassestufe:").instructions(),
        new LabeledDropdown("Klassenzusatz:").instructions(),
        new Checkbox("Gemeinschaftsschule: ").instructions(),
      ]
    };
  }

  public unload() {}
}
