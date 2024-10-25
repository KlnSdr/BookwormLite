class ChangelogItem implements Component {
  private readonly message: string;

  constructor(message: string) {
    this.message = message;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "li",
      text: this.message,
    };
  }

  public unload() {}
}
