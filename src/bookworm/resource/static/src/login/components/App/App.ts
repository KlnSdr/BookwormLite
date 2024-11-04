class App implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        // @ts-ignore include from students project
        new LabeledInput(
          "Loginname:",
          () => {},
          "",
          "inputUsername"
        ).instructions(),
        // @ts-ignore include from students project
        new LabeledInput(
          "Passwort:",
          () => {},
          "",
          "inputPassword",
          "password"
        ).instructions(),
        // @ts-ignore include from students project
        new Button("anmelden", () => doLogin()).instructions(),
      ],
    };
  }

  public unload() {}
}
