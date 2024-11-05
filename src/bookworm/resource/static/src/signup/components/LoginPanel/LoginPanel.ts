class LoginPanel implements Component {
  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["loginPanel"],
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
          "E-Mail:",
          () => {},
          "",
          "inputMail"
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
        new LabeledInput(
          "Passwort bestätigen:",
          () => {},
          "",
          "inputPasswordRepeat",
          "password"
        ).instructions(),
        // @ts-ignore include from students project
        new Button("anmelden", () => doLogin(), ["secondaryButton"]).instructions(),
      ],
    };
  }

  public unload() {}
}
