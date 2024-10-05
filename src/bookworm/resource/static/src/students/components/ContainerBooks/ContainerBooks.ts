class ContainerBooks implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
        classes: ["containerBooks"],
      children: ["Hausaufgabenheft", "Chemie - Heute", "Elemente der Mathematik 5"].map((book: string) => new BookBox(book).instructions())
    };
  }

  public unload() {}
}
