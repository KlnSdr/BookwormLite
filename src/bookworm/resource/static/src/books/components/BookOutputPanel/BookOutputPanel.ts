class BookOutputPanel implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["bookOutputPanel"],
      children: [["Gymnasium", "gym"], ["Gemeinschaftsschule", "gem"]].map(([title, shortName]: string[]) => new BookSchoolTypePanel(title, shortName).instructions())
    };
  }

  public unload() {}
}
