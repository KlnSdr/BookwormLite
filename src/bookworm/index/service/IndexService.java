package bookworm.index.service;

import bookworm.index.DatabaseIndex;
import bookworm.students.StudentsClassAdditionIndex;
import bookworm.students.StudentsGradeIndex;
import dobby.util.json.NewJson;
import thot.connector.Connector;

import java.util.UUID;

public class IndexService {
    public static final String CLASS_ADDITION_INDEX_BUCKET_NAME = "bookworm_class_addition_index";
    public static final String GRADE_INDEX_BUCKET_NAME = "bookworm_grade_index";

    private static IndexService instance;

    private IndexService() {
    }

    public static IndexService getInstance() {
        if (instance == null) {
            instance = new IndexService();
        }
        return instance;
    }

    public void saveClassAdditionIndex(StudentsClassAdditionIndex index) {
        saveIndex(index, CLASS_ADDITION_INDEX_BUCKET_NAME);
    }

    public boolean dropClassAdditionIndex(StudentsClassAdditionIndex index) {
        return dropIndex(index, CLASS_ADDITION_INDEX_BUCKET_NAME);
    }

    public StudentsClassAdditionIndex getClassAdditionIndex(UUID owner) {
        final NewJson json = Connector.read(CLASS_ADDITION_INDEX_BUCKET_NAME, owner.toString(), NewJson.class);
        if (json == null) {
            return new StudentsClassAdditionIndex(owner);
        }

        final StudentsClassAdditionIndex index = new StudentsClassAdditionIndex();
        index.fromJson(json);
        return index;
    }

    public void saveGradeIndex(StudentsGradeIndex index) {
        saveIndex(index, GRADE_INDEX_BUCKET_NAME);
    }

    public boolean dropGradeIndex(StudentsGradeIndex index) {
        return dropIndex(index, GRADE_INDEX_BUCKET_NAME);
    }

    public StudentsGradeIndex getGradeIndex(UUID owner) {
        final NewJson json = Connector.read(GRADE_INDEX_BUCKET_NAME, owner.toString(), NewJson.class);
        if (json == null) {
            return new StudentsGradeIndex(owner);
        }

        final StudentsGradeIndex index = new StudentsGradeIndex();
        index.fromJson(json);
        return index;
    }

    private <T, K> boolean dropIndex(DatabaseIndex<T, K> index, String bucketName) {
        return Connector.delete(bucketName, index.getKey());
    }

    private <T, K> void saveIndex(DatabaseIndex<T, K> index, String bucketName) {
        final NewJson json = index.toJson();
        Connector.write(bucketName, index.getKey(), json);
    }
}
