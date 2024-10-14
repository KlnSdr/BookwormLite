class StudentsExplorer implements Component {
  private static readonly GRADES_GYM: number[] = [5, 6, 7, 8, 9, 10, 11, 12];
  private static readonly GRADES_GS: number[] = [5, 6, 7, 8, 9, 10];

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        {
          ...new Checkbox("Gemeinschaftsschule:", () => {}).instructions(),
          handler: [
            {
              id: "onChange",
              type: "click",
              body: (self: edomElement) => this.toggleGsGym(self),
            },
          ],
        },
        this.getBaseGymInstructions(),
      ],
    };
  }

  private getBaseGSInstructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["studentsExplorer"],
      children: [
        {
          tag: "div",
          classes: ["studentsExplorerColumn"],
          children: StudentsExplorer.GRADES_GS.map((grade: number) =>
            new Button(grade.toString(), () => {}).instructions(),
          ),
        },
        {
          tag: "div",
          classes: ["studentsExplorerColumn"],
          children: [],
        },
        {
          tag: "div",
          classes: ["studentsExplorerColumn"],
          children: [],
        },
      ],
    };
  }

  private getBaseGymInstructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["studentsExplorer"],
      children: [
        {
          tag: "div",
          classes: ["studentsExplorerColumn"],
          children: StudentsExplorer.GRADES_GYM.map((grade: number) =>
            new Button(grade.toString(), () => {}).instructions(),
          ),
        },
        {
          tag: "div",
          classes: ["studentsExplorerColumn"],
          children: [],
        },
        {
          tag: "div",
          classes: ["studentsExplorerColumn"],
          children: [],
        },
      ],
    };
  }

  private toggleGsGym(self: edomElement) {
    const isGem: boolean = (self.children[1].element as HTMLInputElement)
      .checked;
    this.clearColumns(self.parent!);

    if (isGem) {
      edom.fromTemplate([this.getBaseGSInstructions()], self.parent!);
    } else {
      edom.fromTemplate([this.getBaseGymInstructions()], self.parent!);
    }
  }

  private clearColumns(container: edomElement) {
    container.children[1].delete();
  }

  public unload() {}
}
