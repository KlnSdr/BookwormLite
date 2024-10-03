class Input implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "input",
      classes: ["input"]
    };
  }

  public unload() {}
}
