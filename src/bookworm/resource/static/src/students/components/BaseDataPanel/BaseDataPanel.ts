class BaseDataPanel implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["baseDataPanel"],
      children: [
        new LeftBaseDataPanel().instructions(),
        new MiddleBaseDataPanel().instructions(),
        new RightBaseDataPanel().instructions(),
      ]
    };
  }

  public unload() {}
}
