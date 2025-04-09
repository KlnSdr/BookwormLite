package bookworm.students;

import bookworm.index.IntegerDatabaseIndex;
import dobby.util.json.NewJson;
import common.logger.Logger;
import thot.janus.annotations.JanusUUID;

import java.util.UUID;

public class StudentsGradeIndex extends IntegerDatabaseIndex<Student> {
    private static final Logger LOGGER = new Logger(StudentsGradeIndex.class);

    @JanusUUID("owner")
    private UUID owner;

    public StudentsGradeIndex(UUID owner) {
        super();
        this.owner = owner;
    }

    public StudentsGradeIndex() {
        super();
    }

    public void setOwner(UUID owner) {
        this.owner = owner;
    }

    @Override
    public void index(Student object) {
        add(object.getGrade(), object.getKey());
    }

    @Override
    public void unIndex(Student object) {
        remove(object.getGrade(), object.getKey());
    }

    @Override
    public String getKey() {
        return owner.toString();
    }

    @Override
    public NewJson toJson() {
        final NewJson json = super.toJson();
        json.setString("owner", owner.toString());
        return json;
    }

    @Override
    public void fromJson(NewJson json) {
        if (!json.hasKey("owner")) {
            LOGGER.error("Invalid JSON for index");
        }
        super.fromJson(json);
        owner = UUID.fromString(json.getString("owner"));
    }
}
