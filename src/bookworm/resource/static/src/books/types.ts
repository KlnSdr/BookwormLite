interface CreateBook {
  name: string;
  stock: number;
  price: number;
  grades: number[];
  forGem: boolean;
  applyFee: boolean;
}

interface Book extends CreateBook {
  id?: string;
}

interface GradeBooks {
  [key: number]: Book[];
}
