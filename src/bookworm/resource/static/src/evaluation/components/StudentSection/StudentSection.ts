class StudentSection implements Component {
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
      .then((data: EvaluationStudentData[]) => this.generateTable(data))
      .then((table: edomTemplate) => this.renderTable(table))
      .catch((_) => {});

    return {
      tag: "details",
      children: [
        { tag: "summary", text: "Schüler*innen" },
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

  private generateTable(data: EvaluationStudentData[]): Promise<edomTemplate> {
    return new Promise((resolve, reject) => {
      const tableHeadCols: string[] = [
        "Name",
        "Klasse",
        "Kauf",
        "Leih",
        "E-Book",
        "Rechn.",
        "Summe",
      ];

      const table: edomTemplate = {
        tag: "table",
        classes: ["studentTable"],
        children: data.map((student: EvaluationStudentData) =>
          new StudentRow(student).instructions(),
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

  private loadData(): Promise<EvaluationStudentData[]> {
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
          resolve(data);
        })
        .catch((error: Error) => {
          console.error("Error fetching student data", error);
          reject(error);
        });
    });
  }

  public unload() {}
}
