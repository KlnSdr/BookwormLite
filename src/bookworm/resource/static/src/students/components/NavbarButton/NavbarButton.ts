class NavbarButton implements Component {
  private readonly text: string;
  private readonly destination: string;

  public constructor(text: string, destination: string) {
    this.text = text;
    this.destination = destination;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return new Button(this.text, () => {
      console.log(this.destination);
    }).instructions();
  }

  public unload() {}
}
