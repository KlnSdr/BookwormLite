class Dropdown implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "select",
          classes: ["select"],
        children: [
      {
        tag: "option",
        text: "Option 1",
        classes: ["option"]
      },
      {
        tag: "option",
        text: "Option 2",
        classes: ["option"]
      }
    ]
    }
  }

  public unload() {}
}
