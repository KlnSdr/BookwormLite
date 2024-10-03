class redirect implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    window.location.assign("{{CONTEXT}}/students");
    return {
      tag: "p",
      text: "Sie werden weitergeleitet..."
    };
  }

  public unload() {}
}
