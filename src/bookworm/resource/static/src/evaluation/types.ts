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
  name: string;
  classAddition: string;
  sumBuy: number;
  sumBorrow: number;
  eBook: number;
  bill: number;
  books: EvaluationStudentBook[];
}
