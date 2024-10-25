class Link implements Component {
  private readonly url: string;
  private readonly text: string;

  constructor(url: string, text: string) {
    this.url = url;
    this.text = text;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "a",
      classes: ["link"],
      target: this.url,
      text: this.text,
    };
  }

  public unload() {}
}
