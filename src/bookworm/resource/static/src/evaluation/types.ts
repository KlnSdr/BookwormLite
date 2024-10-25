interface BaseFinancialData {
  studentCount: number;
  eBook: number;
  buy: number;
  borrow: number;
  bill: number;
}

interface EvaluationStudentBook {
  name: string;
  type: string;
}

interface EvaluationStudentData {
  id: string;
  name: string;
  classAddition: string;
  sumBuy: number;
  sumBorrow: number;
  eBook: number;
  bill: number;
  books: EvaluationStudentBook[];
}

interface EvaluationBookData {
  name: string;
  sumPriceBuy: number;
  sumPriceBorrow: number;
  buyCount: number;
  borrowCount: number;
}
