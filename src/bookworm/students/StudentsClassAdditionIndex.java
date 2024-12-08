package bookworm.students;

import bookworm.index.StringDatabaseIndex;
import bookworm.index.service.IndexService;
import dobby.util.json.NewJson;
import dobby.util.logging.Logger;
import janus.annotations.JanusUUID;
import thot.annotations.v2.Bucket;

import java.util.UUID;

@Bucket(IndexService.CLASS_ADDITION_INDEX_BUCKET_NAME)
public class StudentsClassAdditionIndex extends StringDatabaseIndex<Student> {
    private static final Logger LOGGER = new Logger(StudentsClassAdditionIndex.class);

    @JanusUUID("owner")
    private UUID owner;

    public StudentsClassAdditionIndex(UUID owner) {
        super();
        this.owner = owner;
    }

    public StudentsClassAdditionIndex() {
        super();
    }

    public void setOwner(UUID owner) {
        this.owner = owner;
    }

    @Override
    public String getKey() {
        return owner.toString();
    }

    @Override
    public void index(Student object) {
        add(object.getClassAddition(), object.getKey());
    }

    @Override
    public void unIndex(Student object) {
        remove(object.getClassAddition(), object.getKey());
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
