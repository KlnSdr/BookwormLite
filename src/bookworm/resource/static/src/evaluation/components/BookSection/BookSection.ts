class BookSection implements Component {
  private readonly grade: string;
  private readonly isGem: boolean;
  private readonly setLoading: () => void;
  private readonly onLoaded: () => void;
  private loadedData: boolean = false;
  private readonly idOutTable: string = Math.random().toString(36);

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

  private populateTable() {
    if (this.loadedData) {
      return;
    }
    this.loadData()
      .then((data: EvaluationBookData[]) => this.generateTable(data))
      .then((table: edomTemplate) => this.renderTable(table))
      .catch((_) => {});
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
        { tag: "summary", text: "Bücher" },
        { tag: "div", id: this.idOutTable, text: "Lade Daten..." },
      ],
    };
  }

  private renderTable(table: edomTemplate) {
    const container: edomElement | undefined = edom.findById(this.idOutTable);

    if (!container) {
      console.error("Container not found");
      return;
    }
    container.text = "";
    edom.fromTemplate([table], container);
  }

  private loadData(): Promise<EvaluationBookData[]> {
    this.setLoading();
    return new Promise((resolve, reject) => {
      fetch(
        `{{CONTEXT}}/rest/evaluation/${this.isGem ? "gem" : "gym"}/grade/${this.grade}/books`,
      )
        .then((response: Response) => {
          if (!response.ok) {
            throw new Error("HTTP error, status = " + response.status);
          }
          return response.json();
        })
        .then(({ books: data }: { books: EvaluationBookData[] }) => {
          this.loadedData = true;
          this.onLoaded();
          resolve(data);
        })
        .catch((error: any) => {
          console.error("Error: ", error);
          this.onLoaded();
          reject(error);
        });
    });
  }

  private generateTable(data: EvaluationBookData[]): Promise<edomTemplate> {
    return new Promise((resolve, reject) => {
      const tableHeadCols: string[] = ["Buch", "kaufen", "leihen"];

      const table: edomTemplate = {
        tag: "table",
        classes: ["studentTable"],
        children: [
          {
            tag: "tbody",
            children: data.map((book: EvaluationBookData) =>
              new BookRow(book).instructions(),
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

  public unload() {}
}
