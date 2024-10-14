class StudentsExplorer implements Component {
  private static readonly GRADES_GYM: number[] = [5, 6, 7, 8, 9, 10, 11, 12];
  private static readonly CLASS_ADDITIONS_GYM: string[] = ["a", "b", "c"];
  private static readonly GRADES_GS: number[] = [5, 6, 7, 8, 9, 10];
  private static readonly CLASS_ADDITIONS_GS: string[] = ["d", "e"];

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
            new Button(grade.toString(), (self: edomElement) =>
              this.openGsGrade(self),
            ).instructions(),
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
            new Button(grade.toString(), (self: edomElement) =>
              this.openGymGrade(self),
            ).instructions(),
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

  private openGsGrade(self: edomElement) {
    this.clearClassadditionColumn(self);
    const classadditionColumn: edomElement = self.parent!.parent!.children[1];

    edom.fromTemplate(
      StudentsExplorer.CLASS_ADDITIONS_GS.map((addition: string) =>
        new Button(addition, () => {}).instructions(),
      ),
      classadditionColumn,
    );
  }

  private openGymGrade(self: edomElement) {
    this.clearClassadditionColumn(self);
    const classadditionColumn: edomElement = self.parent!.parent!.children[1];

    edom.fromTemplate(
      StudentsExplorer.CLASS_ADDITIONS_GYM.map((addition: string) =>
        new Button(addition, () => {}).instructions(),
      ),
      classadditionColumn,
    );
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

  private clearClassadditionColumn(column: edomElement) {
    while (column.children.length > 0) {
      column.children[0].delete();
    }
  }

  public unload() {}
}
