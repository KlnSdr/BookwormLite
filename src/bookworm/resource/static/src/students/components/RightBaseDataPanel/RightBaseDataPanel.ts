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
            }, {
                tag: "label", text: "Kauf: 0€",
            }, {
                tag: "label", text: "Gesamt: 0€",
            }, new Button("speichern", () => {
                console.log("speichern")
            }).instructions(),]
        };
    }

    public unload() {
    }
}
