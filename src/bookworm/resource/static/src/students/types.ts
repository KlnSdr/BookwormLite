interface CreateStudentData {
  name: string;
  bill: number;
  eBookLicense: number;
  fee: number;
  grade: number;
  classAddition: string;
  isGem: boolean;
}

interface StudentData extends CreateStudentData {
  id?: string;
  books: StudentBook[];
}

enum BookUsageType {
  BUY,
  BORROW,
  ALREADY_OWNED,
  NOT_NEEDED,
  UNKNOWN,
}

interface StudentBook {
  id: string;
  type: BookUsageType;
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
