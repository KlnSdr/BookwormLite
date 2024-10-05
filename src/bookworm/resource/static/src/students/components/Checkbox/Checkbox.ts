class Checkbox implements Component {
    private readonly labelText: string;
    private readonly onClick: (val: boolean) => void;

    public constructor(labelText: string, onClick: (val: boolean) => void = () => {}) {
        this.labelText = labelText;
        this.onClick = onClick;
    }

    public render(parent: edomElement) {
        edom.fromTemplate([this.instructions()], parent);
    }

    public instructions(): edomTemplate {
        return {
            tag: "div", classes: ["checkbox"], children: [{
                tag: "label", text: this.labelText, classes: ["label"]
            }, {
                tag: "input", classes: ["input"], type: "checkbox",
                handler: [
                    {
                        type: "click",
                        id: "onClick",
                        body: (self: edomElement) => {
                            this.onClick((self.element as HTMLInputElement).checked);
                        }
                    }
                ]
            }]
        };
    }

    public unload() {
    }
}
