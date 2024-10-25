package bookworm.books.service;

import bookworm.books.Book;
import dobby.util.json.NewJson;
import janus.Janus;
import thot.connector.Connector;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class BooksService {
    public static final String BUCKET_NAME = "bookworm_books";

    private static BooksService instance;

    private BooksService() {
    }

    public static BooksService getInstance() {
        if (instance == null) {
            instance = new BooksService();
        }
        return instance;
    }

    public Book find(UUID id) {
        return Janus.parse(Connector.read(BUCKET_NAME, id.toString(), NewJson.class), Book.class);
    }

    public boolean save(Book book) {
        return Connector.write(BUCKET_NAME, book.getId().toString(), book.toStoreJson());
    }

    public boolean delete(UUID id) {
        return Connector.delete(BUCKET_NAME, id.toString());
    }

    public boolean deleteAll() {
        final NewJson[] allBooks = Connector.readPattern(BUCKET_NAME, ".*", NewJson.class);

        for (NewJson bookJson : allBooks) {
            final Book book = Janus.parse(bookJson, Book.class);
            if (book == null) {
                continue;
            }

            if (!delete(book.getId())) {
                return false;
            }
        }
        return true;
    }

    public List<Book> getForGrade(int grade, boolean isGem) {
        final NewJson[] allBooks = Connector.readPattern(BUCKET_NAME, ".*", NewJson.class);
        final ArrayList<Book> books = new ArrayList<>();

        for (NewJson bookJson : allBooks) {
            final Book book = Janus.parse(bookJson, Book.class);
            if (book == null) {
                continue;
            }
            if (book.getGrades().contains(grade) && book.isForGem() == isGem) {
                books.add(book);
            }
        }

        return books;
    }
}
