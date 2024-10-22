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
          classes: ["appContainer"],
          children: ["Gymnasium", "Gemeinschaftsschule"].map(
            (schoolType: string) =>
              new EvaluationPanel(schoolType).instructions(),
          ),
        },
      ],
    };
  }

  public unload() {}
}
