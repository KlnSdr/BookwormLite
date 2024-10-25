class ChangelogContainer implements Component {
  private readonly changelog: Changelog[];

  constructor(changelog: Changelog[]) {
    this.changelog = changelog;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "details",
      classes: ["changelog"],
      children: [
        {
          tag: "summary",
          text: "Changelog",
        },
        ...this.changelog.map((changelog: Changelog) => {
          return {
            tag: "div",
            children: [
              {
                tag: "p",
                text: changelog.version + " (" + changelog.date + ")",
              },
              {
                tag: "ul",
                children: changelog.changes.map((change: string) =>
                  new ChangelogItem(change).instructions(),
                ),
              },
            ],
          };
        }),
      ],
    };
  }

  public unload() {}
}
