class Alert implements Component {
  private readonly text: string;
  private readonly alertId: string = Math.random().toString(36);
  private readonly progressBarId: string = Math.random().toString(36);
  public constructor(text: string) {
    this.text = text;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    setTimeout(() => this.close(), 2000);
    setTimeout(() => {
      const progressBar: edomElement | undefined = edom.findById(
        this.progressBarId,
      );
      if (progressBar === undefined) {
        return;
      }

      progressBar.element.style.width = "0";
    }, 10);

    return new Popup("", {
      tag: "div",
      classes: ["alert"],
      id: this.alertId,
      children: [
        {
          tag: "p",
          text: this.text,
        },
        new Button("OK", Popup.close).instructions(),
        {
          tag: "div",
          classes: ["progressBar"],
          id: this.progressBarId,
        },
      ],
    }).instructions();
  }

  private close() {
    const alert: edomElement | undefined = edom.findById(this.alertId);
    if (alert === undefined) {
      return;
    }

    Popup.close(alert);
  }

  public static show(text: string) {
    new Alert(text).render(edom.body);
  }

  public unload() {}
}
