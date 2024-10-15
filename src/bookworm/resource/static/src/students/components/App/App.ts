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

  public constructor(initialValue: StudentData | null = null) {
    if (initialValue) {
      this.studentData = initialValue;
    }
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
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
      `{{CONTEXT}}/rest/books/${this.studentData.isGem ? "gem" : "gym"}/grade/${this.studentData.grade}`,
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
        alert("Error fetching books");
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

  public unload() {}
}
