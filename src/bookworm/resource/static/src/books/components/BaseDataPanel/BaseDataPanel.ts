class BaseDataPanel implements Component {
  private bookData: CreateBook = {
    name: "",
    stock: 0,
    price: 0,
    classes: [],
    isGem: false,
    isCalculateFee: false,
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
          (val: number) => this.setPrice(val),
        ).instructions(),
        new MiddleBaseDataPanel(
          (val: number) => this.setLowerClassLimit(val),
          (val: number) => this.setUpperClassLimit(val),
          (val: boolean) => this.setIsGem(val),
          (val: boolean) => this.setIsCalculateFee(val),
        ).instructions(),
        new RightBaseDataPanel(
          () => this.validateBookData(),
          () => this.getBookData(),
          () => this.reset(),
        ).instructions(),
      ],
    };
  }

  private setName(name: string) {
    this.bookData = { ...this.bookData, name };
  }

  private setStock(stock: number) {
    this.bookData = { ...this.bookData, stock };
  }

  private setPrice(price: number) {
    this.bookData = { ...this.bookData, price };
  }

  private setLowerClassLimit(limit: number) {
    this.lowerClassLimit = limit;

    if (this.upperClassLimit !== undefined) {
      if (this.lowerClassLimit > this.upperClassLimit) {
        alert(
          "Die untere Klassenstufe darf nicht größer als die obere Klassenstufe sein!",
        );
        return;
      }

      this.setClasses(
        [...Array(this.upperClassLimit - this.lowerClassLimit + 1).keys()].map(
          (i) => i + this.lowerClassLimit!,
        ),
      );
    } else {
      this.setClasses([this.lowerClassLimit]);
    }
  }

  private setUpperClassLimit(limit: number) {
    this.upperClassLimit = limit;

    if (this.lowerClassLimit !== undefined) {
      if (this.lowerClassLimit > this.upperClassLimit) {
        alert(
          "Die obere Klassenstufe darf nicht kleiner als die untere Klassenstufe sein!",
        );
        return;
      }

      this.setClasses(
        [...Array(this.upperClassLimit - this.lowerClassLimit + 1).keys()].map(
          (i) => i + this.lowerClassLimit!,
        ),
      );
    } else {
      this.setClasses([this.upperClassLimit]);
    }
  }

  private setClasses(classes: number[]) {
    this.bookData = { ...this.bookData, classes };
  }

  private setIsGem(isGem: boolean) {
    this.bookData = { ...this.bookData, isGem };
  }

  private setIsCalculateFee(isCalculateFee: boolean) {
    this.bookData = { ...this.bookData, isCalculateFee };
  }

  private validateBookData(): boolean {
    return (
      this.bookData.name !== "" &&
      this.bookData.stock !== undefined &&
      this.bookData.price !== undefined &&
      this.bookData.classes.length > 0 &&
      this.lowerClassLimit !== undefined &&
      this.upperClassLimit !== undefined &&
      this.lowerClassLimit <= this.upperClassLimit
    );
  }

  private getBookData(): CreateBook {
    return this.bookData;
  }

  private reset() {
    this.bookData = {
      name: "",
      stock: 0,
      price: 0,
      classes: [],
      isGem: false,
      isCalculateFee: false,
    };
    this.lowerClassLimit = undefined;
    this.upperClassLimit = undefined;

    const self: edomElement[] = edom.allElements.filter((e: edomElement) =>
      e.hasStyle("baseDataPanel"),
    );

    if (self.length == 0) {
      return;
    }

    const firstSelf: edomElement = self[0];
    while (firstSelf.children.length > 0) {
      firstSelf.children[0].delete();
    }

    edom.fromTemplate(this.instructions().children ?? [], firstSelf);
  }

  public unload() {}
}
