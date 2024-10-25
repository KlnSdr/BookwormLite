class BookSection implements Component {
  private readonly grade: string;
  private readonly isGem: boolean;
  private readonly idOutTable: string = Math.random().toString(36);

  constructor(grade: string, isGem: boolean) {
    this.grade = grade;
    this.isGem = isGem;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    this.loadData()
      .then((data: EvaluationBookData[]) => this.generateTable(data))
      .then((table: edomTemplate) => this.renderTable(table))
      .catch((_) => {});

    return {
      tag: "details",
      children: [
        { tag: "summary", text: "Bücher" },
        { tag: "div", id: this.idOutTable },
      ],
    };
  }

  private renderTable(table: edomTemplate) {
    const container: edomElement | undefined = edom.findById(this.idOutTable);

    if (!container) {
      console.error("Container not found");
      return;
    }
    edom.fromTemplate([table], container);
  }

  private loadData(): Promise<EvaluationBookData[]> {
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
          resolve(data);
        })
        .catch((error: any) => {
          console.error("Error: ", error);
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
        children: data.map((book: EvaluationBookData) =>
          new BookRow(book).instructions(),
        ),
      };

      const tableHead: edomTemplate = {
        tag: "tr",
        children: tableHeadCols.map((col: string) => ({
          tag: "th",
          text: col,
        })),
      };

      table.children = [tableHead, ...(table.children ?? [])];

      resolve(table);
    });
  }

  public unload() {}
}
