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
    return this.getBaseInstructions(
      StudentsExplorer.GRADES_GS,
      (self: edomElement) => this.openGsGrade(self),
    );
  }

  private getBaseGymInstructions(): edomTemplate {
    return this.getBaseInstructions(
      StudentsExplorer.GRADES_GYM,
      (self: edomElement) => this.openGymGrade(self),
    );
  }

  private getBaseInstructions(
    grades: number[],
    onClick: (self: edomElement) => void,
  ): edomTemplate {
    return {
      tag: "div",
      classes: ["studentsExplorer"],
      children: [
        {
          tag: "div",
          classes: ["studentsExplorerColumn"],
          children: grades.map((grade: number) =>
            new Button(grade.toString(), onClick).instructions(),
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
    this.openGrade(StudentsExplorer.CLASS_ADDITIONS_GS, self);
  }

  private openGymGrade(self: edomElement) {
    this.openGrade(StudentsExplorer.CLASS_ADDITIONS_GYM, self);
  }

  private openGrade(classAdditions: string[], eventTarget: edomElement) {
    const grade: string = eventTarget.text;
    this.clearClassadditionColumn(eventTarget.parent!.parent!.children[1]);
    const classadditionColumn: edomElement =
      eventTarget.parent!.parent!.children[1];

    Popup.changeTitle(eventTarget, "Schüler*in auswählen -> " + grade);

    edom.fromTemplate(
      classAdditions.map((addition: string) =>
        new Button(addition, (self: edomElement) => {
          Popup.changeTitle(
            eventTarget,
            "Schüler*in auswählen -> " + grade + " / " + addition,
          );
        }).instructions(),
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
