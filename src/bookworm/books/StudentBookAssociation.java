package bookworm.books;

import bookworm.books.service.StudentBookAssociationService;
import dobby.util.json.NewJson;
import thot.api.annotations.v2.Bucket;
import thot.janus.DataClass;
import thot.janus.annotations.JanusString;
import thot.janus.annotations.JanusUUID;

import java.util.UUID;

@Bucket(StudentBookAssociationService.BUCKET_NAME)
public class StudentBookAssociation implements DataClass {
    @JanusUUID("owner")
    private UUID owner;
    @JanusUUID("studentId")
    private UUID studentId;
    @JanusUUID("bookId")
    private UUID bookId;
    @JanusString("type")
    private String type;

    public StudentBookAssociation() {
    }

    public StudentBookAssociation(UUID owner, UUID studentId, UUID bookId, BookUsageType type) {
        this.owner = owner;
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

    public UUID getOwner() {
        return owner;
    }

    public void setOwner(UUID owner) {
        this.owner = owner;
    }

    public BookUsageType getType() {
        return BookUsageType.fromString(type);
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String getKey() {
        return owner.toString() + "_" + studentId.toString() + "_" + bookId.toString();
    }

    @Override
    public NewJson toJson() {
        final NewJson json = new NewJson();
        json.setString("studentId", studentId.toString());
        json.setString("owner", owner.toString());
        json.setString("bookId", bookId.toString());
        json.setString("type", type);
        return json;
    }
}
