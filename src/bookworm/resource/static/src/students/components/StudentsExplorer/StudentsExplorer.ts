class StudentsExplorer implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["studentsExplorer"],
      children: [
        {
          tag: "div",
          classes: ["studentsExplorerColumn"],
          children: [
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
          ],
        },
        {
          tag: "div",
          classes: ["studentsExplorerColumn"],
          children: [
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
          ],
        },
        {
          tag: "div",
          classes: ["studentsExplorerColumn"],
          children: [
            new Button("x", (self: edomElement) => {}).instructions(),
            new Button("x", (self: edomElement) => {}).instructions(),
          ],
        },
      ],
    };
  }

  public unload() {}
}
