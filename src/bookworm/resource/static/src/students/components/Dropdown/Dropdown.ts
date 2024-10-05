class Dropdown implements Component {
    private readonly options: string[];
    private readonly onInput: (val: string) => void;

    public constructor(onInput: (val: string) => void = () => {
    }, options: string[] = []) {
        this.onInput = onInput;
        this.options = options;
    }

    public render(parent: edomElement) {
        edom.fromTemplate([this.instructions()], parent);
    }

    public instructions(): edomTemplate {
        return {
            tag: "select", classes: ["select"], handler: [{
                id: "onChange", type: "change", body: (self: edomElement) => {
                    this.onInput((self.element as HTMLSelectElement).value);
                }
            }], children: ["", ...this.options].map((option: string) => {
                return {
                    tag: "option", text: option, classes: ["option"],
                }
            })
        }
    }

    public unload() {
    }
}
