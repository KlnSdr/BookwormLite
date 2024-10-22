class App implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: ["Gymnasium", "Gemeinschaftsschule"].map((schoolType: string) =>
        new EvaluationPanel(schoolType).instructions(),
      ),
    };
  }

  public unload() {}
}
