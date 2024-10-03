class RightBaseDataPanel implements Component {
    public render(parent: edomElement) {
        edom.fromTemplate([this.instructions()], parent);
    }

    public instructions(): edomTemplate {
        return {
            tag: "div",
            classes: ["rightBaseDataPanel"],
            children: [{
                tag: "label", text: "Leih: 0€",
                classes: ["label"]
            }, {
                tag: "label", text: "Kauf: 0€",
                classes: ["label"]
            }, {
                tag: "label", text: "Gesamt: 0€",
                classes: ["label"]
            }, new Button("speichern", () => {
                console.log("speichern")
            }, ["smallFlexButton"]).instructions(),]
        };
    }

    public unload() {
    }
}
