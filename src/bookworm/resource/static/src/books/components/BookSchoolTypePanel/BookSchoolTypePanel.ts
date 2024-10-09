class BookSchoolTypePanel implements Component {
  private readonly title: string;
  private readonly shortName: string;
  private readonly containerId: string = Math.random().toString(36);

  constructor(title: string, shortName: string) {
    this.title = title;
    this.shortName = shortName;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    this.gatherData(5);

    return {
      tag: "div",
      classes: ["bookSchoolTypePanel"],
      children: [
        {
          tag: "h1",
          text: this.title,
        },
        {
          tag: "div",
          id: this.containerId,
          children: [
            {
              tag: "p",
              text: "lade daten...",
            },
          ],
        },
      ],
    };
  }

  private gatherData(grade: number, currentData: Book[] = []) {
    fetch(`{{CONTEXT}}/rest/books/${this.shortName}/grade/${grade}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then((data: { books: Book[] }) => {
        if (grade < 12) {
          this.gatherData(grade + 1, [...currentData, ...data.books]);
          return;
        }
        this.renderWithData(
          BookSchoolTypePanel.removeDuplicates([...currentData, ...data.books]),
        );
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  private static removeDuplicates(data: Book[]): Book[] {
    return data.filter((val: Book, index: number, self: Book[]) => {
      for (let i = 0; i < index; i++) {
        if (self[i].id === val.id) {
          return false;
        }
      }
      return true;
    });
  }

  private static splitIntoGrades(
    data: Book[],
    grade: number = -1,
    currentValue: GradeBooks | null = null,
  ): GradeBooks {
    if (grade === -1) {
      return BookSchoolTypePanel.splitIntoGrades(data, 5, {
        5: [],
        6: [],
        7: [],
        8: [],
        9: [],
        10: [],
        11: [],
        12: [],
      });
    }

    if (grade > 12) {
      return (
        currentValue || {
          5: [],
          6: [],
          7: [],
          8: [],
          9: [],
          10: [],
          11: [],
          12: [],
        }
      );
    }

    const returnData: GradeBooks = currentValue || {};
    returnData[grade] = data.filter((value) => value.grades.includes(grade));

    return BookSchoolTypePanel.splitIntoGrades(
      data.filter((value) => !value.grades.includes(grade)),
      ++grade,
      returnData,
    );
  }

  private renderWithData(data: Book[]) {
    const gradeBooks: GradeBooks = BookSchoolTypePanel.splitIntoGrades(data);

    const container = edom.findById(this.containerId);
    if (!container) {
      console.error("Container not found");
      return;
    }

    while (container.children.length > 0) {
      container.children[0].delete();
    }

    edom.fromTemplate([this.instructionsWithData(gradeBooks)], container);
  }

  private instructionsWithData(data: GradeBooks): edomTemplate {
    return {
      tag: "div",
      children: Object.keys(data)
        .map((k: string) => parseInt(k))
        .filter((key: number) => data[key].length > 0)
        .map((key: number) =>
          new BookGradeSection(key, data[key]).instructions(),
        ),
    };
  }

  public unload() {}
}
