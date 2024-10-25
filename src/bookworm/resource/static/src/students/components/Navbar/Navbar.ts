interface NavbarElement {
  text: string;
  destination: string;
}

interface DynamicLink {
  text: string;
  action: () => void;
}

class Navbar implements Component {
  private static navbarElements: NavbarElement[] = [
    {
      text: "Daten eintragen",
      destination: "{{CONTEXT}}/students",
    },
    {
      text: "Bücher",
      destination: "{{CONTEXT}}/books",
    },
    {
      text: "Auswertung",
      destination: "{{CONTEXT}}/evaluation",
    },
  ];
  private dynamicLinks: DynamicLink[];

  public constructor(dynamicLinks: DynamicLink[] = []) {
    this.dynamicLinks = dynamicLinks;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["navbar"],
      children: [
        {
          tag: "div",
          classes: ["navLeft"],
          children: [
            ...(this.dynamicLinks.length > 0
              ? [
                  ...this.dynamicLinks.map((link: DynamicLink) =>
                    new Button(link.text, link.action).instructions(),
                  ),
                  {
                    tag: "div",
                    classes: ["verticalNavbarLine"],
                  },
                ]
              : []),
            ...Navbar.navbarElements.map((element: NavbarElement) =>
              new NavbarButton(
                element.text,
                element.destination,
              ).instructions(),
            ),
          ],
        },
        {
          tag: "div",
          classes: ["navRight"],
          children: [new NavbarButton("🛈", "{{CONTEXT}}/info").instructions()],
        },
      ],
    };
  }

  public unload() {}
}
