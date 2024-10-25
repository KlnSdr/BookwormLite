class App implements Component {
  private static readonly dynamicLinks: DynamicLink[] = [
    {
      text: "Schüler*in auswählen",
      action: () => {
        StudentsExplorerPopup.show();
      },
    },
  ];

  private studentData: StudentData = {
    name: "",
    bill: 0,
    eBookLicense: 0,
    fee: 0,
    grade: 0,
    classAddition: "",
    isGem: false,
    books: [],
  };

  private initialBooks: Book[] = [];

  public constructor(
    initialValue: StudentData | null = null,
    books: Book[] | null = null,
  ) {
    if (initialValue) {
      this.studentData = initialValue;
    }

    if (books) {
      this.initialBooks = books;
    }

    this.checkUrlParam();
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => {
      edom.fromTemplate(
        [
          new ContainerBooks(
            this.initialBooks,
            (book: string, option: BookUsageType) =>
              this.updateBooks(book, option),
            this.studentData.books,
          ).instructions(),
        ],
        edom.body,
      );
    }, 10);
    return {
      tag: "div",
      classes: ["app"],
      children: [
        new Navbar(App.dynamicLinks).instructions(),
        new BaseDataPanel(
          (val: string) => this.setName(val),
          (val: string) => this.setBill(val),
          (val: string) => this.setEBookLicense(val),
          (val: string) => this.setFee(val),
          (val: string) => this.setGrade(val),
          (val: string) => this.setClassAddition(val),
          (val: boolean) => this.setIsGem(val),
          () => this.getStudentData(),
          () => this.validateStudentData(),
        ).instructions(),
      ],
    };
  }

  private updateBookContainer() {
    const bookContainer: edomElement[] = edom.allElements.filter(
      (elm: edomElement) => elm.classes.includes("containerBooks"),
    );

    if (bookContainer.length > 0) {
      bookContainer[0].delete();
    }

    if (isNaN(this.studentData.grade)) {
      return;
    }

    fetch(
      `{{CONTEXT}}/rest/books/${this.studentData.isGem ? "gem" : "gym"}/grade/${
        this.studentData.grade
      }`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("HTTP error " + response.status);
        }
        return response.json();
      })
      .then(({ books: data }: { books: Book[] }) => {
        edom.fromTemplate(
          [
            new ContainerBooks(data, (book: string, option: BookUsageType) =>
              this.updateBooks(book, option),
            ).instructions(),
          ],
          edom.body,
        );
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
        Alert.show("Error fetching books");
      });
  }

  private setName(val: string) {
    this.studentData = {
      ...this.studentData,
      name: val,
    };
  }

  private setBill(val: string) {
    this.studentData = {
      ...this.studentData,
      bill: parseFloat(val),
    };
  }

  private setEBookLicense(val: string) {
    this.studentData = {
      ...this.studentData,
      eBookLicense: parseFloat(val),
    };
  }

  private setFee(val: string) {
    this.studentData = {
      ...this.studentData,
      fee: parseFloat(val),
    };
  }

  private setGrade(val: string) {
    this.studentData = {
      ...this.studentData,
      grade: parseFloat(val),
    };
    this.updateBookContainer();
    this.resetBooks();
  }

  private setClassAddition(val: string) {
    this.studentData = {
      ...this.studentData,
      classAddition: val,
    };
  }

  private setIsGem(val: boolean) {
    this.studentData = {
      ...this.studentData,
      isGem: val,
    };
    this.updateBookContainer();
    this.resetBooks();
  }

  private updateBooks(book: string, option: BookUsageType) {
    const books = this.studentData.books;
    const bookIndex = books.findIndex(
      (studentBook: StudentBook) => studentBook.id === book,
    );
    if (bookIndex === -1) {
      books.push({
        id: book,
        type: option,
      });
    } else {
      books[bookIndex] = {
        id: book,
        type: option,
      };
    }

    this.studentData = {
      ...this.studentData,
      books: books,
    };
  }

  private resetBooks() {
    this.studentData = {
      ...this.studentData,
      books: [],
    };
  }

  private getStudentData(): StudentData {
    return this.studentData;
  }

  private validateStudentData(): boolean {
    return (
      this.studentData.name.trim() !== "" &&
      this.studentData.books.length > 0 &&
      this.studentData.classAddition.trim() !== "" &&
      this.studentData.grade >= 5 &&
      this.studentData.grade <= 12 &&
      [1, 2, 3].includes(this.studentData.fee)
    );
  }

  public unload() {}

  public static reset() {
    App.remove();
    edom.fromTemplate([new App().instructions()], edom.body);
  }

  private checkUrlParam() {
    const urlParams = new URLSearchParams(window.location.search);
    const studentId = urlParams.get("open");
    if (!studentId) {
      return;
    }
    window.history.replaceState({}, document.title, window.location.pathname);

    this.loadStudent(studentId)
      .then((studentData: StudentData) => {
        Promise.all([
          this.loadBooksForStudent(studentData.id!),
          this.loadBooksForGrade(studentData.grade, studentData.isGem),
        ]).then(([studentBooks, books]: [StudentBook[], Book[]]) => {
          App.remove();
          edom.fromTemplate(
            [
              new App(
                {
                  ...studentData,
                  books: studentBooks,
                },
                books,
              ).instructions(),
            ],
            edom.body,
          );
        });
      })
      .catch((error: Error) => {
        Alert.show("Ein Fehler beim Laden des/der Schüler*in ist aufgetreten.");
      });
  }

  private loadStudent(id: string): Promise<StudentData> {
    return new Promise((resolve, reject) => {
      fetch(`{{CONTEXT}}/rest/students/id/${id}`)
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then((student: StudentData) => resolve(student))
        .catch((error: Error) => {
          console.error("Error fetching student:", error);
          reject(error);
        });
    });
  }

  // todo copied fom StudentsExplorer -> make pretty/non redundant
  private async loadBooksForGrade(
    grade: number,
    isGem: boolean,
  ): Promise<Book[]> {
    return fetch(
      `{{CONTEXT}}/rest/books/${isGem ? "gem" : "gym"}/grade/${grade}`,
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
        }),
      )
      .catch((reason) => {
        console.error(reason);
        throw reason;
      });
  }

  public static remove() {
    const appElement: edomElement | undefined = edom.allElements.find(
      (element: edomElement) => element.classes.includes("app"),
    );

    if (appElement === undefined) {
      console.error("no app element found!");
      return;
    }
    appElement.delete();

    const bookContainerElement: edomElement | undefined = edom.allElements.find(
      (element: edomElement) => element.classes.includes("containerBooks"),
    );

    if (bookContainerElement !== undefined) {
      bookContainerElement.delete();
    }
  }
}
