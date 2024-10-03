class App implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
          new Navbar().instructions(),
          new BaseDataPanel().instructions(),
          new ContainerBooks().instructions()
      ]
    };
  }

  public unload() {}
}
