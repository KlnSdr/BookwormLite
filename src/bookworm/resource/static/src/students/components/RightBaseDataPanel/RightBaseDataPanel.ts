class RightBaseDataPanel implements Component {
    private readonly getStudentData: () => StudentData;
    private readonly idBorrowLabel: string = Math.random().toString(36);
    private readonly idBuyLabel: string = Math.random().toString(36);
    private readonly idResultLabel: string = Math.random().toString(36);
    private timer: number | null = null;

    public constructor(getStudentData: () => StudentData) {
        this.getStudentData = getStudentData;
        this.timer = setInterval(() => this.updateLabels(), 1000);
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
                classes: ["label"],
                id: this.idBorrowLabel
            }, {
                tag: "label", text: "Kauf: 0€",
                classes: ["label"],
                id: this.idBuyLabel
            }, {
                tag: "label", text: "Gesamt: 0€",
                classes: ["label"],
                id: this.idResultLabel
            }, new Button("speichern", () => this.saveStudentData(), ["secondaryButton", "smallFlexButton"]).instructions(),]
        };
    }

    private updateLabels() {
        // todo update other labels based on books
        const studentData: StudentData = this.getStudentData();

        const sumLabel: edomElement | undefined = edom.findById(this.idResultLabel);

        if (sumLabel === undefined) {
            return;
        }

        sumLabel.text = `Gesamt: ${studentData.bill}€`;
    }

    private saveStudentData() {
        console.log("saving student data...");
        console.log(this.getStudentData());
    }

    public unload() {
        if (this.timer !== null) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}
