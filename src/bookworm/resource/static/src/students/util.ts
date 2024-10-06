function bookUsageTypeFromString(type: string): BookUsageType {
    switch (type) {
        case "kaufen":
            return BookUsageType.BUY;
        case "leihen":
            return BookUsageType.BORROW;
        case "vorhanden":
            return BookUsageType.ALREADY_OWNED;
        case "nicht benötigt":
            return BookUsageType.NOT_NEEDED;
        default:
            return BookUsageType.UNKNOWN;
    }
}
