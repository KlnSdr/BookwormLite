package bookworm.books;

import dobby.util.json.NewJson;
import thot.janus.DataClass;

public class StudentBook implements DataClass {
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

    /**
     * not needed
     * @return an empty string
     */
    @Override
    public String getKey() {
        return "";
    }

    @Override
    public NewJson toJson() {
        final NewJson json = new NewJson();

        json.setJson("book", book.toJson());
        json.setString("type", usageType.toString());

        return json;
    }
}
