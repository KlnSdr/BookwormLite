package bookworm.books.service;

import bookworm.books.Book;
import bookworm.books.StudentBook;
import bookworm.books.StudentBookAssociation;
import bookworm.students.Student;
import dobby.util.json.NewJson;
import janus.Janus;
import thot.connector.Connector;

import java.util.Arrays;
import java.util.UUID;

public class StudentBookAssociationService {
    public static final String BUCKET_NAME = "bookworm_student_book_associations";

    private static StudentBookAssociationService instance;

    private StudentBookAssociationService() {
    }

    public static StudentBookAssociationService getInstance() {
        if (instance == null) {
            instance = new StudentBookAssociationService();
        }
        return instance;
    }

    public boolean save(StudentBookAssociation association) {
        return Connector.write(BUCKET_NAME, association.getKey(), association.toJson());
    }

    public StudentBook[] getUsageOfBook(UUID bookId) {
        final NewJson[] bookAssocJson = Connector.readPattern(BUCKET_NAME, ".*_" + bookId.toString(), NewJson.class);

        return getStudentBooks(bookAssocJson);
    }

    public StudentBook[] getBooksForStudent(UUID studentId) {
        final NewJson[] bookAssocJson = Connector.readPattern(BUCKET_NAME, studentId.toString() + "_.*", NewJson.class);

        return getStudentBooks(bookAssocJson);
    }

    private StudentBook[] getStudentBooks(NewJson[] bookAssocJson) {
        if (bookAssocJson == null) {
            return null;
        }

        final StudentBookAssociation[] bookAssoc = new StudentBookAssociation[bookAssocJson.length];
        for (int i = 0; i < bookAssocJson.length; i++) {
            bookAssoc[i] = Janus.parse(bookAssocJson[i], StudentBookAssociation.class);
        }

        final UUID[] bookIds = Arrays.stream(bookAssoc).map(StudentBookAssociation::getBookId).toArray(UUID[]::new);

        final StudentBook[] result = new StudentBook[bookIds.length];
        for (int i = 0; i < bookIds.length; i++) {
            final Book book = BooksService.getInstance().find(bookIds[i]);
            result[i] = new StudentBook(book, bookAssoc[i].getType());
        }

        return result;
    }
}
