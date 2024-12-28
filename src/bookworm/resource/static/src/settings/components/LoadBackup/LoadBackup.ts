class LoadBackup implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["backupUploadContainer"],
      children: [
        {
          tag: "input",
          type: "file",
          id: "fileUploadDataBackup",
        },
        // @ts-ignore imported from students project
        new Button("Datei verifizieren und hochladen", (self: edomElement) => {
          this.verifyAndUploadBackup(self);
        }).instructions(),
      ],
    };
  }

  private verifyAndUploadBackup(source: edomElement) {
    source.text = "...";
    const fileInput: edomElement | undefined = edom.findById(
      "fileUploadDataBackup"
    );

    if (!fileInput) {
      // @ts-ignore imported from students project
      Alert.show("Fehler: Datei konnte nicht gelesen werden!");
      return;
    }

    // @ts-ignore imported from students project
    Popup.changeTitle(source, "Analysiere Backupdatei...");

    const files: FileList | null = (fileInput.element as HTMLInputElement)
      .files;

    if (files === null || files.length === 0) {
      // @ts-ignore imported from students project
      Alert.show("Fehler: Datei konnte nicht gelesen werden!");
      return;
    }

    const file: File = files[0];
    LoadBackup.readFile(file)
      .then((content: string) => {
        // @ts-ignore imported from students project
        Popup.changeTitle(source, "Verfiziere Backupdatei...");
        return LoadBackup.verifyContent(content);
      })
      .then((jsonData) => {
        return LoadBackup.uploadData(jsonData, source);
      })
      .then(() => {
        // @ts-ignore imported from students project
        Popup.close(source);
        // @ts-ignore imported from students project
        Alert.show("Daten erfolgreich importiert!");
      })
      .catch((err) => {
        console.error(err);
        // @ts-ignore imported from students project
        Alert.show(
          "Fehler: Backup konnte nicht vollständig hochgeladen werden!"
        );
      });
  }

  private static uploadData(
    data: {
      students: Student[];
      books: Book[];
      associations: Association[];
    },
    eventSource: edomElement
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      // @ts-ignore imported from students project
      Popup.changeTitle(eventSource, "Lade Bücher hoch...");

      LoadBackup.uploadBooks(data.books)
        .then((newIds: string[][]) => {
          const idMap: { [key: string]: string } = {};
          newIds.forEach((newId: string[]) => {
            idMap[newId[0]] = newId[1];
          });

          data.associations = data.associations.map(
            (assoc: Association, index: number) => {
              return {
                ...data.associations[index],
                bookId: idMap[assoc.bookId],
              };
            }
          );

          // @ts-ignore imported from students project
          Popup.changeTitle(eventSource, "Lade Schüler*innen hoch...");

          // return Promise.all(data.students.map(LoadBackup.uploadStudent));
          return LoadBackup.uploadStudents(data.students);
        })
        .then((newIds: string[][]) => {
          // @ts-ignore imported from students project
          Popup.changeTitle(
            eventSource,
            "Lade Bücher für Schüler*innen hoch..."
          );

          const idMap: { [key: string]: string } = {};
          newIds.forEach((newId: string[]) => {
            idMap[newId[0]] = newId[1];
          });

          data.associations = data.associations.map(
            (assoc: Association, index: number) => {
              return {
                ...data.associations[index],
                studentId: idMap[assoc.studentId],
              };
            }
          );

          data.students.forEach((s: Student) => {
            s.id = idMap[s.id];
          });

          const assocs: Association[][] = [];

          data.students.map((student: Student) => {
            assocs.push(
              data.associations.filter(
                (a: Association) => a.studentId === student.id
              )
            );
          });

          return LoadBackup.uploadAssocs(data.students, assocs);
        })
        .then(() => {
          resolve();
        })
        .catch(reject);
    });
  }

  private static uploadBooks(books: Book[]): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      fetch("{{CONTEXT}}/rest/books/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          books: books.map((b) => {
            return {
              name: b.name,
              price: parseFloat(b.price),
              grades: b.grades,
              applyFee: b.applyFee,
              forGem: b.forGem,
              stock: b.stock,
            };
          }),
        }),
      })
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(
              "HTTP " +
                response.status +
                " " +
                response.statusText +
                " " +
                response.text()
            );
          }
          return response.json();
        })
        .then((val: { books: Book[] }) => {
          const res: string[][] = [];

          for (let i = 0; i < books.length; i++) {
            res.push([books[i].id, val.books[i].id]);
          }

          resolve(res);
        })
        .catch(reject);
    });
  }

  private static uploadStudents(students: Student[]): Promise<string[][]> {
    return new Promise((resolve, reject) => {
      fetch("{{CONTEXT}}/rest/students/batch", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          students: students.map((s) => {
            return {
              grade: s.grade,
              classAddition: s.classAddition,
              isGem: s.isGem,
              fee: s.fee,
              name: s.name,
              eBookLicense: s.eBookLicense,
              bill: s.bill,
            };
          }),
        }),
      })
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(
              "HTTP " +
                response.status +
                " " +
                response.statusText +
                " " +
                response.text()
            );
          }
          return response.json();
        })
        .then((val: { students: Student[] }) => {
          const res: string[][] = [];

          for (let i = 0; i < students.length; i++) {
            res.push([students[i].id, val.students[i].id]);
          }

          resolve(res);
        })
        .catch(reject);
    });
  }

  private static uploadAssocs(
    students: Student[],
    assocs: Association[][]
  ): Promise<void> {
    const payloadContent: {
      studentId: string;
      books: { id: string; type: string }[];
    }[] = [];

    for (let i = 0; i < students.length; i++) {
      payloadContent.push({
        studentId: students[i].id,
        books: assocs[i].map((a: Association) => {
          return {
            id: a.bookId,
            type: a.type,
          };
        }),
      });
    }

    return new Promise((resolve, reject) => {
      fetch(`{{CONTEXT}}/rest/students/batch/books`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          assocs: payloadContent,
        }),
      })
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error(
              "HTTP " +
                response.status +
                " " +
                response.statusText +
                " " +
                response.text()
            );
          }
          resolve();
        })
        .catch(reject);
    });
  }

  private static readFile(file: File): Promise<string> {
    return new Promise((resolve, _reject) => {
      (async () => {
        const fileContent = await file.text();
        resolve(fileContent);
      })();
    });
  }

  private static verifyContent(content: string): Promise<any> {
    return new Promise((resolve, reject) => {
      let jsonData;
      try {
        jsonData = JSON.parse(content);
      } catch (error) {
        console.error(error);
        reject(error);
      }
      if (
        LoadBackup.verifyJsonStructure(jsonData) &&
        LoadBackup.verifySensibleJson(jsonData)
      ) {
        resolve(jsonData);
      } else {
        reject("Malformed Data");
      }
    });
  }

  private static verifySensibleJson({
    students,
    books,
    associations,
  }: {
    students: Student[];
    books: Book[];
    associations: Association[];
  }): boolean {
    if (
      !students.every(
        (student: Student) =>
          students.filter((s: Student) => s.id === student.id).length === 1
      )
    ) {
      return false;
    }

    if (
      !books.every(
        (book: Book) => books.filter((b: Book) => b.id === book.id).length === 1
      )
    ) {
      return false;
    }

    for (const i in associations) {
      const assoc: Association = associations[i];

      if (
        students.find((s: Student) => s.id === assoc.studentId) === undefined
      ) {
        return false;
      }

      if (books.find((b: Book) => b.id === assoc.bookId) === undefined) {
        return false;
      }
    }

    return true;
  }

  private static verifyJsonStructure(data: any): boolean {
    if (
      data["associations"] === undefined ||
      data["books"] === undefined ||
      data["students"] === undefined
    ) {
      return false;
    }
    return (
      LoadBackup.verifyBooksStructure(data) &&
      LoadBackup.verifyStudentsStructure(data) &&
      LoadBackup.verifyAssocStructure(data)
    );
  }

  private static verifyAssocStructure(data: any): boolean {
    if (!Array.isArray(data["associations"])) {
      return false;
    }
    return data["associations"].every((book: any) =>
      LoadBackup.isValidAssoc(book)
    );
  }

  private static verifyBooksStructure(data: any): boolean {
    if (!Array.isArray(data["books"])) {
      return false;
    }
    return data["books"].every((book: any) => LoadBackup.isValidBook(book));
  }

  private static verifyStudentsStructure(data: any): boolean {
    if (!Array.isArray(data["students"])) {
      return false;
    }
    return data["students"].every((book: any) =>
      LoadBackup.isValidStudent(book)
    );
  }

  private static isValidBook(data: any): boolean {
    return (
      typeof data === "object" &&
      data !== null &&
      typeof data.price === "string" &&
      typeof data.name === "string" &&
      typeof data.id === "string" &&
      typeof data.stock === "number" &&
      typeof data.forGem === "boolean" &&
      typeof data.applyFee === "boolean" &&
      Array.isArray(data.grades) &&
      data.grades.every((v: any) => typeof v === "number")
    );
  }

  private static isValidStudent(data: any): boolean {
    return (
      typeof data === "object" &&
      data !== null &&
      typeof data.name === "string" &&
      typeof data.classAddition === "string" &&
      typeof data.id === "string" &&
      typeof data.grade === "number" &&
      typeof data.fee === "number" &&
      typeof data.eBookLicense === "number" &&
      typeof data.bill === "number" &&
      typeof data.isGem === "boolean"
    );
  }

  private static isValidAssoc(data: any): boolean {
    return (
      typeof data === "object" &&
      data !== null &&
      typeof data.studentId === "string" &&
      typeof data.owner === "string" &&
      typeof data.type === "string" &&
      ["BORROW", "NOT_NEEDED", "ALREADY_OWNED", "BUY"].includes(data.type) &&
      typeof data.bookId === "string"
    );
  }

  public unload() {}
}
