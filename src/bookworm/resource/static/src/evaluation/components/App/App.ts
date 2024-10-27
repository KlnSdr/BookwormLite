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
        new Navbar([
          { text: "Export", action: () => ExportPopup.show() },
        ]).instructions(),
        {
          tag: "div",
          classes: ["appContainer"],
          children: [
            {
              tag: "div",
              children: [
                {
                  tag: "h1",
                  text: "Anzeigeeinstellungen",
                },
                // @ts-ignore included from students project
                new Checkbox(
                  "nicht eingetragene Bücher markieren",
                  (val: boolean) => {
                    if (val) {
                      this.markEmptyTableCells();
                    } else {
                      this.resetMarkedTableCells();
                    }
                  },
                  false,
                ).instructions(),
              ],
            },
            ...[
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
          ],
        },
      ],
    };
  }

  private markEmptyTableCells() {
    edom.allElements
      .filter(
        (element: edomElement) =>
          element.tag.toLowerCase() === "td" && element.text === "",
      )
      .forEach((element: edomElement) => {
        element.applyStyle("emptyTableCellMarker");
      });
  }

  private resetMarkedTableCells() {
    edom.allElements
      .filter(
        (element: edomElement) =>
          element.tag.toLowerCase() === "td" && element.text === "",
      )
      .forEach((element: edomElement) => {
        element.removeStyle("emptyTableCellMarker");
      });
  }

  public unload() {}
}
