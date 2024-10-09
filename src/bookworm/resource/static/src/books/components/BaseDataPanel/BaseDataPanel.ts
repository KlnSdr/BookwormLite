class BaseDataPanel implements Component {
  private bookData: Book = {
    name: "",
    stock: 0,
    price: 0,
    classes: [],
    isGem: false,
    isCalculateFee: false
  };

  private lowerClassLimit: number | undefined = undefined;
  private upperClassLimit: number | undefined = undefined;

  public render(parent: edomElement) {
    edom.fromTemplate([this.instructions()], parent);
  }

  public instructions(): edomTemplate {
    return {
      tag: "div",
      classes: ["baseDataPanel"],
      children: [
        new LeftBaseDataPanel(
            (val: string) => this.setName(val),
            (val: number) => this.setStock(val),
            (val: number) => this.setPrice(val)
        ).instructions(),
        new MiddleBaseDataPanel(
            (val: number) => this.setLowerClassLimit(val),
            (val: number) => this.setUpperClassLimit(val),
            (val: boolean) => this.setIsGem(val),
            (val: boolean) => this.setIsCalculateFee(val),
        ).instructions(),
        new RightBaseDataPanel(
            () => this.validateBookData(),
            () => this.getBookData()
        ).instructions(),
      ]
    };
  }

  private setName(name: string) {
    this.bookData = { ...this.bookData, name };
    console.log(this.bookData);
  }

  private setStock(stock: number) {
    this.bookData = { ...this.bookData, stock };
    console.log(this.bookData);
  }

  private setPrice(price: number) {
    this.bookData = { ...this.bookData, price };
    console.log(this.bookData);
  }

  private setLowerClassLimit(limit: number) {
    this.lowerClassLimit = limit;

    if (this.upperClassLimit !== undefined) {
      if (this.lowerClassLimit > this.upperClassLimit) {
        alert("Die untere Klassenstufe darf nicht größer als die obere Klassenstufe sein!");
        return;
      }

      this.setClasses([...Array(this.upperClassLimit - this.lowerClassLimit + 1).keys()].map(i => i + this.lowerClassLimit!));
    } else {
        this.setClasses([this.lowerClassLimit]);
    }
  }

  private setUpperClassLimit(limit: number) {
    this.upperClassLimit = limit;

    if (this.lowerClassLimit !== undefined) {
      if (this.lowerClassLimit > this.upperClassLimit) {
        alert("Die obere Klassenstufe darf nicht kleiner als die untere Klassenstufe sein!");
        return;
      }

      this.setClasses([...Array(this.upperClassLimit - this.lowerClassLimit + 1).keys()].map(i => i + this.lowerClassLimit!));
    } else {
        this.setClasses([this.upperClassLimit]);
    }
  }

  private setClasses(classes: number[]) {
    this.bookData = { ...this.bookData, classes };
    console.log(this.bookData);
  }

  private setIsGem(isGem: boolean) {
    this.bookData = { ...this.bookData, isGem };
    console.log(this.bookData);
  }

  private setIsCalculateFee(isCalculateFee: boolean) {
    this.bookData = { ...this.bookData, isCalculateFee };
    console.log(this.bookData);
  }

  private validateBookData(): boolean {
    return this.bookData.name !== ""
        && this.bookData.stock > 0
        && this.bookData.price > 0
        && this.bookData.classes.length > 0
        && this.lowerClassLimit !== undefined
        && this.upperClassLimit !== undefined
        && this.lowerClassLimit <= this.upperClassLimit;
  }

  private getBookData(): Book {
    return this.bookData;
  }

  public unload() {}
}
