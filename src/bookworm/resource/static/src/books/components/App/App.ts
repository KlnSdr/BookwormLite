class App implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        // @ts-ignore included from students project
        new Navbar().instructions(),
        {
          tag: "div",
          id: "appContainerBasePanel",
          children: [new BaseDataPanel().instructions()],
        },
        new BookOutputPanel().instructions(),
      ],
    };
  }

  public unload() {}
}
