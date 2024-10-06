class Radiobutton implements Component {
    private readonly text: string;
    private readonly name: string;
    private readonly onClick: () => void;

    public constructor(text: string, name: string = "", onClick: () => void = () => {}) {
        this.text = text;
        this.name = name;
        this.onClick = onClick;
    }

    public render(parent: edomElement) {
        edom.fromTemplate([this.instructions()], parent);
    }

    public instructions(): edomTemplate {
        return {
            tag: "div", children: [{
                tag: "input", type: "radio", name: this.name,
                handler: [
                    {
                        type: "click",
                        id: "onClick",
                        body: (self: edomElement) => {
                            this.onClick();
                        }
                    }
                ]
            }, {
                tag: "label", classes: ["label"], text: this.text
            }]
        };
    }

    public unload() {
    }
}
