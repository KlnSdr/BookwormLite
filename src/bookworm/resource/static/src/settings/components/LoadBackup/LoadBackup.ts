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
          this.verifyAndUploadBackup();
          // @ts-ignore imported from students project
          Popup.close(self);
        }).instructions(),
      ],
    };
  }

  private verifyAndUploadBackup() {
    const fileInput: edomElement | undefined = edom.findById(
      "fileUploadDataBackup"
    );

    if (!fileInput) {
      // TODO show error message
      return;
    }

    const files: FileList | null = (fileInput.element as HTMLInputElement)
      .files;

    if (files === null || files.length === 0) {
      // TODO show error message
      return;
    }

    const file: File = files[0];
    LoadBackup.readFile(file)
      .then(LoadBackup.verifyContent)
      .then(LoadBackup.uploadData)
      .then(() => {
        console.log("done!");
      })
      .catch((err) => {
        console.error(err);
      });
  }

  private static uploadData(data: {
    students: Student[];
    books: Book[];
    associations: Association[];
  }): Promise<void> {
    return new Promise((resolve, reject) => {
      Promise.all(data.books.map(LoadBackup.uploadBook))
        .then((newIds: string[][]) => {
          const idMap: { [key: string]: string } = {};
          newIds.forEach((newId: string[]) => {
            idMap[newId[0]] = newId[1];
          });

          data.associations = data.associations.map((assoc: Association, index: number) => {
            return {
              ...data.associations[index],
              bookId: idMap[assoc.bookId],
            };
          });

          return Promise.all(data.students.map(LoadBackup.uploadStudent));
        })
        .then((newIds: string[][]) => {
          const idMap: { [key: string]: string } = {};
          newIds.forEach((newId: string[]) => {
            idMap[newId[0]] = newId[1];
          });

          data.associations = data.associations.map((assoc: Association, index: number) => {
            return {
              ...data.associations[index],
              studentId: idMap[assoc.studentId],
            };
          });

          data.students.forEach((s: Student) => {
            s.id = idMap[s.id];
          });

          return Promise.all(
            data.students.map((s: Student) => {
              LoadBackup.uploadAssocs(
                s,
                data.associations.filter((a: Association) => a.studentId === s.id)
              );
            })
          );
        })
        .then(() => {
          resolve();
        })
        .catch(reject);
    });
  }

  private static uploadBook(book: Book): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fetch("{{CONTEXT}}/rest/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: book.name,
          price: parseFloat(book.price),
          grades: book.grades,
          applyFee: book.applyFee,
          forGem: book.forGem,
          stock: book.stock,
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
        .then((val: Book) => {
          resolve([book.id, val.id]);
        })
        .catch(reject);
    });
  }

  private static uploadStudent(student: Student): Promise<string[]> {
    return new Promise((resolve, reject) => {
      fetch("{{CONTEXT}}/rest/students", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          grade: student.grade,
          classAddition: student.classAddition,
          isGem: student.isGem,
          fee: student.fee,
          name: student.name,
          eBookLicense: student.eBookLicense,
          bill: student.bill,
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
        .then((val: Student) => {
          resolve([student.id, val.id]);
        })
        .catch(reject);
    });
  }

  private static uploadAssocs(
    student: Student,
    assocs: Association[]
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      fetch(`{{CONTEXT}}/rest/students/id/${student.id}/books`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          books: assocs.map((a: Association) => {
            return {
              id: a.bookId,
              type: a.type,
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
        // TODO show error message because of wrong file content
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