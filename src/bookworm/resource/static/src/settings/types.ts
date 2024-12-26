interface Student {
  name: string;
  classAddition: string;
  id: string;
  grade: number;
  fee: number;
  eBookLicense: number;
  bill: number;
  isGem: boolean;
}

interface Book {
  price: string;
  name: string;
  id: string;
  stock: number;
  forGem: boolean;
  applyFee: boolean;
  grades: number[];
}

interface Association {
  studentId: string;
  owner: string;
  type: string;
  bookId: string;
}
