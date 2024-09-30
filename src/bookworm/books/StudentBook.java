package bookworm.books;

public class StudentBook {
    private final Book book;
    private final BookUsageType usageType;

    public StudentBook(Book book, BookUsageType usageType) {
        this.book = book;
        this.usageType = usageType;
    }

    public Book getBook() {
        return book;
    }

    public BookUsageType getUsageType() {
        return usageType;
    }
}
