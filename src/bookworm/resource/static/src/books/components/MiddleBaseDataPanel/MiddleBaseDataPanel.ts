class MiddleBaseDataPanel implements Component {
  private static readonly GRADES = ["5", "6", "7", "8", "9", "10", "11", "12"];
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        // @ts-ignore included from students project
        new LabeledDropdown("Klassenstufe von:", () => {}, MiddleBaseDataPanel.GRADES).instructions(),
        // @ts-ignore included from students project
        new LabeledDropdown("Klassenstufe bis:", () => {}, MiddleBaseDataPanel.GRADES).instructions(),
        // @ts-ignore included from students project
        new Checkbox("Gemeinschaftsschule:").instructions(),
        // @ts-ignore included from students project
        new Checkbox("Leihgebühr berechnen:").instructions(),
      ]
    };
  }

  public unload() {}
}
