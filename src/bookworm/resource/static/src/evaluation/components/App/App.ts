class App implements Component {
  private static readonly GRADES_GYM = [
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];
  private static readonly GRADES_GEM = ["5", "6", "7", "8", "9", "10"];

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
          children: [
            { text: "Gymnasium", isGem: false, grades: App.GRADES_GYM },
            {
              text: "Gemeinschaftsschule",
              isGem: true,
              grades: App.GRADES_GEM,
            },
          ].map(
            ({
              text,
              isGem,
              grades,
            }: {
              text: string;
              isGem: boolean;
              grades: string[];
            }) => new EvaluationPanel(text, isGem, grades).instructions(),
          ),
        },
      ],
    };
  }

  public unload() {}
}
