class RightBaseDataPanel implements Component {
    private readonly getStudentData: () => void;
    public constructor(getStudentData: () => void = () => {}) {
        this.getStudentData = getStudentData;
    }

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
            }, new Button("speichern", () => this.saveStudentData(), ["secondaryButton", "smallFlexButton"]).instructions(),]
        };
    }

    private saveStudentData() {
        console.log("saving student data...");
        console.log(this.getStudentData());
    }

    public unload() {
    }
}
