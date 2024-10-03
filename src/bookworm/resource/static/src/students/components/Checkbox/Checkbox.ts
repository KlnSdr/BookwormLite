class Checkbox implements Component {
    private readonly labelText: string;

    public constructor(labelText: string) {
        this.labelText = labelText;
    }

    public render(parent: edomElement) {
        edom.fromTemplate([this.instructions()], parent);
    }

    public instructions(): edomTemplate {
        return {
            tag: "div", classes: ["checkbox"], children: [{
                tag: "label", text: this.labelText, classes: ["label"]
            }, {
                tag: "input", classes: ["input"], type: "checkbox"
            }]
        };
    }

    public unload() {
    }
}
