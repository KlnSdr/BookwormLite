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
      (self: edomElement) => this.openGsGrade(self)
    );
  }

  private getBaseGymInstructions(): edomTemplate {
    return this.getBaseInstructions(
      StudentsExplorer.GRADES_GYM,
      (self: edomElement) => this.openGymGrade(self)
    );
  }

  private getBaseInstructions(
    grades: number[],
    onClick: (self: edomElement) => void
  ): edomTemplate {
    return {
      tag: "div",
      classes: ["studentsExplorer"],
      children: [
        {
          tag: "div",
          classes: ["studentsExplorerColumn"],
          children: grades.map((grade: number) =>
            new Button(grade.toString(), onClick).instructions()
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
    this.openGrade(true, StudentsExplorer.CLASS_ADDITIONS_GS, self);
  }

  private openGymGrade(self: edomElement) {
    this.openGrade(false, StudentsExplorer.CLASS_ADDITIONS_GYM, self);
  }

  private openGrade(
    isGem: boolean,
    classAdditions: string[],
    eventTarget: edomElement
  ) {
    const grade: string = eventTarget.text;
    const classadditionColumn: edomElement =
      eventTarget.parent!.parent!.children[1];
    this.clearClassadditionColumn(classadditionColumn);

    while (eventTarget.parent!.parent!.children[2].children.length > 0) {
      eventTarget.parent!.parent!.children[2].children[0].delete();
    }

    Popup.changeTitle(
      eventTarget,
      "Schüler*in auswählen -> " +
        (isGem ? "Gemeinschaftsschule" : "Gymnasium") +
        " / " +
        grade
    );

    edom.fromTemplate(
      classAdditions.map((addition: string) =>
        new Button(addition, (self: edomElement) => {
          Popup.changeTitle(
            eventTarget,
            "Schüler*in auswählen -> " +
              (isGem ? "Gemeinschaftsschule" : "Gymnasium") +
              " / " +
              +grade +
              " / " +
              addition
          );
          this.loadStudents(isGem, grade, addition).then(
            (data: StudentData[]) => {
              this.displayLoadedStudents(self, data);
            }
          );
        }).instructions()
      ),
      classadditionColumn
    );
  }

  private displayLoadedStudents(eventTarget: edomElement, data: StudentData[]) {
    const colStudents: edomElement = eventTarget.parent!.parent!.children[2];
    while (colStudents.children.length > 0) {
      colStudents.children[0].delete();
    }

    if (data.length === 0) {
      edom.fromTemplate(
        [
          {
            tag: "p",
            text: "Keine Schüler*innen gefunden.",
          },
        ],
        colStudents
      );
      return;
    }

    data.sort((a: StudentData, b: StudentData) => {
      return a.name.localeCompare(b.name);
    });

    edom.fromTemplate(
      data.map((student) =>
        new Button(student.name, (self: edomElement) => {
          Popup.close(self);

          Promise.all([
            this.loadBooksForStudent(student.id!),
            this.loadBooksForGrade(student.grade, student.isGem),
          ]).then(([studentBooks, books]: [StudentBook[], Book[]]) => {
            App.remove();
            edom.fromTemplate(
              [
                new App(
                  {
                    ...student,
                    books: studentBooks,
                  },
                  books
                ).instructions(),
              ],
              edom.body
            );
          });
        }).instructions()
      ),
      colStudents
    );
  }

  private async loadBooksForGrade(
    grade: number,
    isGem: boolean
  ): Promise<Book[]> {
    return fetch(
      `{{CONTEXT}}/rest/books/${isGem ? "gem" : "gym"}/grade/${grade}`
    )
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then(({ books: data }: { books: Book[] }) => data)
      .catch((reason) => {
        console.error(reason);
        throw reason;
      });
  }

  private async loadBooksForStudent(studentId: string): Promise<StudentBook[]> {
    return fetch(`{{CONTEXT}}/rest/students/id/${studentId}/books`)
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then(({ books: data }: { books: { type: string; book: Book }[] }) =>
        data.map((book: { type: string; book: Book }) => {
          return {
            type: bookUsageTypeFromBackendString(book.type),
            id: book.book.id,
          };
        })
      )
      .catch((reason) => {
        console.error(reason);
        throw reason;
      });
  }

  private loadStudents(
    isGem: boolean,
    grade: string,
    classAddition: string
  ): Promise<StudentData[]> {
    return new Promise((resolve, reject) =>
      fetch(
        `{{CONTEXT}}/rest/students/${
          isGem ? "gem" : "gym"
        }/grade/${grade}/class/${classAddition}`
      )
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then(({ students: data }: { students: StudentData[] }) => {
          resolve(data);
        })
        .catch((reason) => {
          console.error(reason);
          reject(reason);
        })
    );
  }

  private toggleGsGym(self: edomElement) {
    const isGem: boolean = (self.children[1].element as HTMLInputElement)
      .checked;
    this.clearColumns(self.parent!);

    Popup.changeTitle(
      self,
      "Schüler*in auswählen -> " + (isGem ? "Gemeinschaftsschule" : "Gymnasium")
    );

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
