class CenterInfoPanel implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["center50pContainer"],
      children: [
        {
          tag: "h1",
          text: BookwormInfo.appInfo.name,
        },
        {
          tag: "p",
          text: "Version: v" + BookwormInfo.appInfo.version,
        },
        {
          tag: "p",
          text: "Autor: ",
          children: [
            new Link(
              "https://github.com/" + BookwormInfo.appInfo.author,
              BookwormInfo.appInfo.author,
            ).instructions(),
          ],
        },
        {
          tag: "p",
          text: "Lizenz: ",
          children: [
            new Link(
              BookwormInfo.appInfo.vcsLink + "/blob/main/LICENSE",
              BookwormInfo.appInfo.license,
            ).instructions(),
          ],
        },
        new Link(BookwormInfo.appInfo.vcsLink, "Sourcecode").instructions(),
        new ChangelogContainer(BookwormInfo.changelog).instructions(),
      ],
    };
  }

  public unload() {}
}
