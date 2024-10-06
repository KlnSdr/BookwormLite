interface StudentData {
    name: string;
    bill: number;
    eBookLicense: number;
    fee: number;
    grade: number;
    classAddition: string;
    isGem: boolean;
    books: StudentBook[];
};

enum BookUsageType {
    BUY,
    BORROW,
    ALREADY_OWNED,
    NOT_NEEDED,
    UNKNOWN
};

interface StudentBook {
    id: string;
    type: BookUsageType;
}