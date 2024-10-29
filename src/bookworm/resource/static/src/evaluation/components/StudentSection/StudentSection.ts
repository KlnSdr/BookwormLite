class StudentSection implements Component {
  private readonly grade: string;
  private readonly isGem: boolean;
  private readonly setLoading: () => void;
  private readonly onLoaded: () => void;
  private loadedData: boolean = false;
  private readonly idOutTable: string = Math.random().toString(36).substring(2);

  constructor(
    grade: string,
    isGem: boolean,
    setLoading: () => void,
    onLoaded: () => void,
  ) {
    this.grade = grade;
    this.isGem = isGem;
    this.setLoading = setLoading;
    this.onLoaded = onLoaded;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "details",
      handler: [
        {
          id: "click",
          type: "click",
          body: (self: edomElement) => this.populateTable(),
        },
      ],
      children: [
        { tag: "summary", text: "Schüler*innen" },
        { tag: "div", id: this.idOutTable, text: "Lade Daten..." },
      ],
    };
  }

  private populateTable() {
    if (this.loadedData) {
      return;
    }
    this.loadData()
      .then((data: EvaluationStudentData[]) => this.generateTable(data))
      .then((table: edomTemplate) => this.renderTable(table))
      .catch((_) => {});
  }

  private renderTable(table: edomTemplate) {
    const container: edomElement | undefined = edom.findById(this.idOutTable);

    if (!container) {
      console.error("Container not found");
      return;
    }
    container.text = "";
    edom.fromTemplate([table], container);

    setTimeout(() => {
      // @ts-ignore
      new DataTable(`#${this.idOutTable}TABLE`, {
        paging: false,
        searching: false,
        order: false,
        info: false,
        layout: {
          topStart: {
            buttons: [
              {
                extend: "excelHtml5",
                title: `students_${this.isGem ? "gem" : "gym"}_${this.grade}`,
                text: "Exportieren als Excel",
              },
            ],
          },
        },
      });

      // cursed hack to style the export buttons
      setTimeout(() => {
        Array.from(document.getElementsByClassName("dt-button")).forEach(
          (e: Element) => {
            e.classList.add("button");
          },
        );
      }, 10);
    }, 10);
  }

  private generateTable(data: EvaluationStudentData[]): Promise<edomTemplate> {
    return new Promise((resolve, reject) => {
      const tableHeadCols: string[] = [
        "Name",
        "Klasse",
        "Kauf",
        "Leih",
        "E-Book",
        "Rechn.",
      ];

      const books: string[] = [];

      data.forEach((student: EvaluationStudentData) => {
        student.books.forEach((book: EvaluationStudentBook) => {
          if (!books.includes(book.name)) {
            books.push(book.name);
          }
        });
      });
      books.sort();

      tableHeadCols.push(...books, "Summe", "Unterschrift");

      const table: edomTemplate = {
        tag: "table",
        classes: ["studentTable"],
        id: this.idOutTable + "TABLE",
        children: [
          {
            tag: "tbody",
            children: data.map((student: EvaluationStudentData) =>
              new StudentRow(student, books).instructions(),
            ),
          },
        ],
      };

      const tableHead: edomTemplate = {
        tag: "thead",
        children: [
          {
            tag: "tr",
            children: tableHeadCols.map((col: string) => ({
              tag: "th",
              text: col,
            })),
          },
        ],
      };

      table.children = [tableHead, ...(table.children ?? [])];

      resolve(table);
    });
  }

  private loadData(): Promise<EvaluationStudentData[]> {
    this.setLoading();
    return new Promise((resolve, reject) => {
      fetch(
        `{{CONTEXT}}/rest/evaluation/${this.isGem ? "gem" : "gym"}/grade/${this.grade}/students`,
      )
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error("HTTP error " + response.status);
          }
          return response.json();
        })
        .then(({ students: data }: { students: EvaluationStudentData[] }) => {
          this.loadedData = true;
          this.onLoaded();
          resolve(data);
        })
        .catch((error: Error) => {
          console.error("Error fetching student data", error);
          this.onLoaded();
          reject(error);
        });
    });
  }

  public unload() {}
}
