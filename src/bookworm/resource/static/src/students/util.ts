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

function bookUsageTypeToString(type: BookUsageType): string {
  switch (type) {
    case BookUsageType.BUY:
      return "BUY";
    case BookUsageType.BORROW:
      return "BORROW";
    case BookUsageType.ALREADY_OWNED:
      return "ALREADY_OWNED";
    case BookUsageType.NOT_NEEDED:
      return "NOT_NEEDED";
    default:
      return "UNKNOWN";
  }
}
