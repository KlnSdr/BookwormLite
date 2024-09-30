package bookworm.books;

import bookworm.books.service.StudentBookAssociationService;
import dobby.util.json.NewJson;
import janus.DataClass;
import janus.annotations.JanusString;
import janus.annotations.JanusUUID;
import thot.annotations.Bucket;

import java.util.UUID;

@Bucket(StudentBookAssociationService.BUCKET_NAME)
public class StudentBookAssociation implements DataClass {
    @JanusUUID("studentId")
    private UUID studentId;
    @JanusUUID("bookId")
    private UUID bookId;
    @JanusString("type")
    private String type;

    public StudentBookAssociation() {
    }

    public StudentBookAssociation(UUID studentId, UUID bookId, BookUsageType type) {
        this.studentId = studentId;
        this.bookId = bookId;
        this.type = type.toString();
    }

    public UUID getStudentId() {
        return studentId;
    }

    public void setStudentId(UUID studentId) {
        this.studentId = studentId;
    }

    public UUID getBookId() {
        return bookId;
    }

    public void setBookId(UUID bookId) {
        this.bookId = bookId;
    }

    public BookUsageType getType() {
        return BookUsageType.fromString(type);
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String getKey() {
        return studentId.toString() + "_" + bookId.toString();
    }

    @Override
    public NewJson toJson() {
        final NewJson json = new NewJson();
        json.setString("studentId", studentId.toString());
        json.setString("bookId", bookId.toString());
        json.setString("type", type);
        return json;
    }
}
