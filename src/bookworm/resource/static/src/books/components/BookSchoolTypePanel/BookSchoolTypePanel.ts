class BookSchoolTypePanel implements Component {
  private readonly title: string;
  private readonly shortName: string;

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
          tag: "p",
          text: "...",
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
    console.log(data);
    console.log(BookSchoolTypePanel.splitIntoGrades(data));
  }

  private instructionsWithData(data: Book[]): edomTemplate {
    return {
      tag: "div",
    };
  }

  public unload() {}
}
