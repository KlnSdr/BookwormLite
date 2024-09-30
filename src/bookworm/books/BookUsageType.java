package bookworm.books;

public enum BookUsageType {
    BUY,
    BORROW,
    ALREADY_OWNED,
    NOT_NEEDED,
    UNKNOWN;

    public static BookUsageType fromString(String str) {
        return switch (str.toUpperCase()) {
            case "BUY" -> BUY;
            case "BORROW" -> BORROW;
            case "ALREADY_OWNED" -> ALREADY_OWNED;
            case "NOT_NEEDED" -> NOT_NEEDED;
            default -> UNKNOWN;
        };
    }
}
