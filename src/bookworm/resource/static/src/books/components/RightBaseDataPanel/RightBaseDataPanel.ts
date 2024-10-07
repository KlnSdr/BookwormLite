class RightBaseDataPanel implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["rightBaseDataPanel"],
      children: [
        // @ts-ignore included from students project
        new Checkbox("Gemeinschaftsschule").instructions(),
        // @ts-ignore included from students project
        new Checkbox("Leihgebühr berechnen").instructions(),
        // @ts-ignore included from students project
        new Button("speichern", () => {}, ["secondaryButton", "smallFlexButton"]).instructions()
      ]
    };
  }

  public unload() {}
}
