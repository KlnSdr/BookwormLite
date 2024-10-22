class BookSection implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "details",
      children: [{ tag: "summary", text: "Bücher" }],
    };
  }

  public unload() {}
}
