class LeftBaseDataPanel implements Component {
  private readonly setName: (name: string) => void;
  private readonly setStock: (stock: number) => void;
  private readonly setPrice: (price: number) => void;

  constructor(setName: (name: string) => void, setStock: (stock: number) => void, setPrice: (price: number) => void) {
    this.setName = setName;
    this.setStock = setStock;
    this.setPrice = setPrice;
  }

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      children: [
        // @ts-ignore included from students project
        new LabeledInput("Name:", this.setName).instructions(),
        // @ts-ignore included from students project
        new LabeledInput("Bestand:", (val: string) => this.setStock(parseInt(val))).instructions(),
        // @ts-ignore included from students project
        new LabeledInput("Preis (€):", (val: string) => this.setPrice(parseFloat(val))).instructions(),
      ]
    };
  }

  public unload() {}
}
