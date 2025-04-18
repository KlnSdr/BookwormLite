package bookworm.books.service;

import bookworm.books.Book;
import bookworm.books.StudentBook;
import bookworm.books.StudentBookAssociation;
import bookworm.students.Student;
import bookworm.students.service.StudentsService;
import dobby.util.json.NewJson;
import thot.connector.Connector;
import thot.janus.Janus;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
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

    public boolean delete(String associationId) {
        return Connector.delete(BUCKET_NAME, associationId);
    }

    public boolean deleteAll(UUID owner) {
        for (StudentBookAssociation association : getAll(owner)) {
            if (!delete(association.getKey())) {
                return false;
            }
        }

        return true;
    }

    public StudentBookAssociation[] getAll(UUID owner) {
        final NewJson[] associations = Connector.readPattern(BUCKET_NAME, owner + "_.*", NewJson.class);
        final List<StudentBookAssociation> assocs = new ArrayList<>();

        for (NewJson association : associations) {
            final StudentBookAssociation assoc = Janus.parse(association, StudentBookAssociation.class);

            if (assoc == null) {
                continue;
            }
            assocs.add(assoc);
        }

        return assocs.toArray(new StudentBookAssociation[0]);
    }

    public StudentBook[] getUsageOfBook(UUID owner, UUID bookId) {
        final NewJson[] bookAssocJson = Connector.readPattern(BUCKET_NAME, owner + "_.*_" + bookId.toString(), NewJson.class);

        return getStudentBooks(owner, bookAssocJson);
    }

    public StudentBook[] getUsageOfBook(UUID owner, UUID bookId, int grade) {
        final NewJson[] bookAssocJson = Connector.readPattern(BUCKET_NAME, owner + "_.*_" + bookId.toString(), NewJson.class);

        return getStudentBooks(owner, bookAssocJson, true, grade);
    }

    public StudentBook[] getBooksForStudent(UUID owner, UUID studentId) {
        final NewJson[] bookAssocJson = Connector.readPattern(BUCKET_NAME, owner + "_" + studentId.toString() + "_.*", NewJson.class);

        return getStudentBooks(owner, bookAssocJson);
    }

    private StudentBook[] getStudentBooks(UUID owner, NewJson[] bookAssocJson) {
        return getStudentBooks(owner, bookAssocJson, false, -1);
    }

    private StudentBook[] getStudentBooks(UUID owner, NewJson[] bookAssocJson, boolean doFilter, int grade) {
        if (bookAssocJson == null) {
            return null;
        }

        final StudentBookAssociation[] bookAssoc = new StudentBookAssociation[bookAssocJson.length];
        for (int i = 0; i < bookAssocJson.length; i++) {
            bookAssoc[i] = Janus.parse(bookAssocJson[i], StudentBookAssociation.class);
        }

        final StudentBookAssociation[] bookAssocFiltered;
        if (doFilter) {
            final List<StudentBookAssociation> arrBookAssocFiltered = new ArrayList<>();
            for (StudentBookAssociation assoc : bookAssoc) {
                final UUID studentId = assoc.getStudentId();
                final Student student = StudentsService.getInstance().find(owner, studentId);

                if (student == null) {
                    continue;
                }

                if (student.getGrade() == grade) {
                    arrBookAssocFiltered.add(assoc);
                }
            }

            bookAssocFiltered = arrBookAssocFiltered.toArray(new StudentBookAssociation[0]);
        } else {
            bookAssocFiltered = bookAssoc;
        }

        final UUID[] bookIds = Arrays.stream(bookAssocFiltered).map(StudentBookAssociation::getBookId).toArray(UUID[]::new);

        final StudentBook[] result = new StudentBook[bookIds.length];
        for (int i = 0; i < bookIds.length; i++) {
            final Book book = BooksService.getInstance().find(owner, bookIds[i]);
            result[i] = new StudentBook(book, bookAssocFiltered[i].getType());
        }

        return result;
    }
}
