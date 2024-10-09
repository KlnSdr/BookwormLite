interface CreateBook {
  name: string;
  stock: number;
  price: number;
  classes: number[];
  isGem: boolean;
  isCalculateFee: boolean;
}

interface Book {
  id: string;
  name: string;
  stock: number;
  price: number;
  grades: number[];
  forGem: boolean;
  applyFee: boolean;
}

interface GradeBooks {
  [key: number]: Book[];
}
