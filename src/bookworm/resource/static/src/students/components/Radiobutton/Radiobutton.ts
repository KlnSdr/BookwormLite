class Radiobutton implements Component {
    private readonly text: string;
    private readonly name: string;

    public constructor(text: string, name: string = "") {
        this.text = text;
        this.name = name;
    }

    public render(parent: edomElement) {
        edom.fromTemplate([this.instructions()], parent);
    }

    public instructions(): edomTemplate {
        return {
            tag: "div", children: [{
                tag: "input", type: "radio", name: this.name,
            }, {
                tag: "label", classes: ["label"], text: this.text
            }]
        };
    }

    public unload() {
    }
}
