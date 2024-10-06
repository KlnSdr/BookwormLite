class App implements Component {
    private studentData: StudentData = {
        name: "",
        bill: 0,
        eBookLicense: 0,
        fee: 0,
        grade: 0,
        classAddition: "",
        isGem: false,
        books: []
    };

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
          new Navbar().instructions(),
          new BaseDataPanel(
              (val: string) => this.setName(val),
              (val: string) => this.setBill(val),
              (val: string) => this.setEBookLicense(val),
              (val: string) => this.setFee(val),
              (val: string) => this.setGrade(val),
              (val: string) => this.setClassAddition(val),
              (val: boolean) => this.setIsGem(val),
              () => this.getStudentData()
          ).instructions(),
          new ContainerBooks(
              (book: string, option: BookUsageType) => this.updateBooks(book, option)
          ).instructions()
      ]
    };
  }

    private setName(val: string) {
        this.studentData = {
            ...this.studentData,
            name: val
        };
        console.log(this.studentData);
    }

    private setBill(val: string) {
        this.studentData = {
            ...this.studentData,
            bill: parseFloat(val)
        };
        console.log(this.studentData);
    }

    private setEBookLicense(val: string) {
        this.studentData = {
            ...this.studentData,
            eBookLicense: parseFloat(val)
        };
        console.log(this.studentData);
    }

    private setFee(val: string) {
        this.studentData = {
            ...this.studentData,
            fee: parseFloat(val)
        };
        console.log(this.studentData);
    }

    private setGrade(val: string) {
        this.studentData = {
            ...this.studentData,
            grade: parseFloat(val)
        };
        console.log(this.studentData);
    }

    private setClassAddition(val: string) {
        this.studentData = {
            ...this.studentData,
            classAddition: val
        };
        console.log(this.studentData);
    }

    private setIsGem(val: boolean) {
        this.studentData = {
            ...this.studentData,
            isGem: val
        };
        console.log(this.studentData);
    }

    private updateBooks(book: string, option: BookUsageType) {
        const books = this.studentData.books;
        const bookIndex = books.findIndex((studentBook: StudentBook) => studentBook.id === book);
        if (bookIndex === -1) {
            books.push({
                id: book,
                type: option
            });
        } else {
            books[bookIndex] = {
                id: book,
                type: option
            };
        }

        this.studentData = {
            ...this.studentData,
            books: books
        };
        console.log(this.studentData);
    }

    private getStudentData(): StudentData {
        return this.studentData;
    }

  public unload() {}
}
