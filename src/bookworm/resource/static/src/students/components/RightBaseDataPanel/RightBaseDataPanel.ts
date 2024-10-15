class RightBaseDataPanel implements Component {
  private readonly getStudentData: () => StudentData;
  private readonly idBorrowLabel: string = Math.random().toString(36);
  private readonly idBuyLabel: string = Math.random().toString(36);
  private readonly idResultLabel: string = Math.random().toString(36);
  private timer: number | null = null;

  public constructor(getStudentData: () => StudentData) {
    this.getStudentData = getStudentData;
    this.timer = setInterval(() => this.updateLabels(), 1000);
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["rightBaseDataPanel"],
      children: [
        {
          tag: "label",
          text: "Leih: 0€",
          classes: ["label"],
          id: this.idBorrowLabel,
        },
        {
          tag: "label",
          text: "Kauf: 0€",
          classes: ["label"],
          id: this.idBuyLabel,
        },
        {
          tag: "label",
          text: "Gesamt: 0€",
          classes: ["label"],
          id: this.idResultLabel,
        },
        new Button("speichern", () => this.saveStudentData(), [
          "secondaryButton",
          "smallFlexButton",
        ]).instructions(),
      ],
    };
  }

  private updateLabels() {
    // todo update other labels based on books
    const studentData: StudentData = this.getStudentData();

    const sumLabel: edomElement | undefined = edom.findById(this.idResultLabel);

    if (sumLabel === undefined) {
      return;
    }

    sumLabel.text = `Gesamt: ${studentData.bill}€`;
  }

  private saveStudentData() {
    const studentData: StudentData = this.getStudentData();

    if (studentData.id === undefined) {
      this.saveNewStudentData(studentData);
      return;
    }
    this.updateExistingStudent(studentData);
  }

  private updateExistingStudent(data: StudentData) {
    fetch(`{{CONTEXT}}/rest/students/id/${data.id!}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }

        return response.json();
      })
      .then((data: StudentData) => {
        if (data.id === undefined) {
          throw new Error("No id returned");
        }
        this.saveBooksForStudent(data.id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  private saveNewStudentData(data: StudentData) {
    const studentData: CreateStudentData = RightBaseDataPanel.transform(data);

    fetch("{{CONTEXT}}/rest/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(studentData),
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }

        return response.json();
      })
      .then((data: StudentData) => {
        if (data.id === undefined) {
          throw new Error("No id returned");
        }
        this.saveBooksForStudent(data.id);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  private saveBooksForStudent(studentId: string) {
    const studentData: StudentData = this.getStudentData();
    const books: StudentBook[] = studentData.books;

    fetch("{{CONTEXT}}/rest/students/id/" + studentId + "/books", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        books: books.map((book: StudentBook) => {
          return {
            id: book.id,
            type: bookUsageTypeToString(book.type),
          };
        }),
      }),
    })
      .then((response: Response) => {
        if (!response.ok) {
          throw new Error("HTTP error, status = " + response.status);
        }
        console.log("Books saved");
      })
      .catch((reason) => {
        console.error("Error:", reason);
      });
  }

  private static transform(data: StudentData): CreateStudentData {
    console.log(data);
    return {
      name: data.name,
      bill: data.bill,
      eBookLicense: data.eBookLicense,
      fee: data.fee,
      grade: data.grade,
      classAddition: data.classAddition,
      isGem: data.isGem,
    };
  }

  public unload() {
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}
