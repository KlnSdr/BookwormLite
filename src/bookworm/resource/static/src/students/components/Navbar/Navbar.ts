interface NavbarElement {
  text: string;
  destination: string;
};

class Navbar implements Component {
  private static navbarElements: NavbarElement[] = [
    {
      text: "Daten eintragen",
      destination: "{{CONTEXT}}/students"
    },
    {
      text: "Bücher",
      destination: "{{CONTEXT}}/books"
    },
    {
      text: "Auswertung",
      destination: "{{CONTEXT}}/"
    },
  ];

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["navbar"],
      children: Navbar.navbarElements.map((element: NavbarElement) => new NavbarButton(element.text, element.destination).instructions())
    };
  }

  public unload() {}
}
