package bookworm.books.service;

import bookworm.books.Book;
import bookworm.books.StudentBook;
import bookworm.books.StudentBookAssociation;
import bookworm.students.Student;
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

    public StudentBook[] getBooksForStudent(UUID studentId) {
        final StudentBookAssociation[] bookAssoc = Connector.readPattern(BUCKET_NAME, studentId.toString() + "_.*", StudentBookAssociation.class);

        if (bookAssoc == null) {
            return null;
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
