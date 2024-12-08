package bookworm.students.service;

import bookworm.index.service.IndexService;
import bookworm.students.Student;
import bookworm.students.StudentsClassAdditionIndex;
import bookworm.students.StudentsGradeIndex;
import dobby.util.json.NewJson;
import janus.Janus;
import thot.connector.Connector;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.UUID;

public class StudentsService {
    public static final String BUCKET_NAME = "bookworm_students";

    private static StudentsService instance;
    private final static IndexService indexService = IndexService.getInstance();

    private StudentsService() {
    }

    public static StudentsService getInstance() {
        if (instance == null) {
            instance = new StudentsService();
        }
        return instance;
    }

    public Student find(UUID owner, UUID id) {
        return Janus.parse(Connector.read(BUCKET_NAME, owner + "_" + id, NewJson.class), Student.class);
    }

    public boolean save(Student student) {
        updateIndexAdded(student);
        return Connector.write(BUCKET_NAME, student.getKey(), student.toStoreJson());
    }

    public boolean delete(UUID owner, UUID id) {
        final Student student = find(owner, id);
        if (student == null) {
            return true;
        }
        updateIndexRemoved(student);
        return Connector.delete(BUCKET_NAME, owner + "_" + id);
    }

    public boolean deleteAll(UUID owner) {
        for (Student student: getAll(owner)) {
            if (!delete(owner, student.getId())) {
                return false;
            }
        }
        return true;
    }

    public Student[] getAll(UUID owner) {
        final StudentsClassAdditionIndex index = indexService.getClassAdditionIndex(owner);
        final List<String> keys = new ArrayList<>();

        for(Set<String> indexedKeys : index.getAll().values()) {
            keys.addAll(indexedKeys);
        }
        final List<String> matchingKeys = new ArrayList<>();
        for (String key : keys) {
            if (key.startsWith(owner + "_")) {
                matchingKeys.add(key);
            }
        }

        final ArrayList<Student> students = new ArrayList<>();
        for (String studentKey : matchingKeys) {
            final NewJson studentJson = Connector.read(BUCKET_NAME, studentKey, NewJson.class);

            final Student student = Janus.parse(studentJson, Student.class);
            if (student == null) {
                continue;
            }
            students.add(student);
        }
        return students.toArray(new Student[0]);
    }

    public Student[] getForGrade(UUID owner, int grade, boolean isGem) {
        final StudentsGradeIndex index = indexService.getGradeIndex(owner);
        final List<String> keys = new ArrayList<>(index.getFor(grade).stream().toList());

        final ArrayList<Student> students = new ArrayList<>();
        for (String key: keys) {
            final Student student = Janus.parse(Connector.read(BUCKET_NAME, key, NewJson.class), Student.class);
            if (student.isGem() == isGem) {
                students.add(student);
            }
        }
        return students.toArray(new Student[0]);
    }

    public Student[] getForGradeAndClassAddition(UUID owner, int grade, String classAddition, boolean isGem) {
        final StudentsGradeIndex gradeIndex = indexService.getGradeIndex(owner);
        final List<String> keysGrade = new ArrayList<>(gradeIndex.getFor(grade).stream().toList());

        final StudentsClassAdditionIndex classAdditionIndex = indexService.getClassAdditionIndex(owner);
        final List<String> keysClassAddition = new ArrayList<>(classAdditionIndex.getFor(classAddition).stream().toList());

        final List<String> keys = new ArrayList<>(keysGrade);
        keys.retainAll(keysClassAddition);


        final ArrayList<Student> students = new ArrayList<>();
        for (String key: keys) {
            final Student student = Janus.parse(Connector.read(BUCKET_NAME, key, NewJson.class), Student.class);
            if (student == null) {
                continue;
            }

            if (student.isGem() == isGem) {
                students.add(student);
            }
        }
        return students.toArray(new Student[0]);
    }

    private void updateIndexAdded(Student student) {
        final StudentsClassAdditionIndex index = indexService.getClassAdditionIndex(student.getOwner());
        index.index(student);
        indexService.saveClassAdditionIndex(index);

        final StudentsGradeIndex gradeIndex = indexService.getGradeIndex(student.getOwner());
        gradeIndex.index(student);
        indexService.saveGradeIndex(gradeIndex);
    }

    private void updateIndexRemoved(Student student) {
        final StudentsClassAdditionIndex index = indexService.getClassAdditionIndex(student.getOwner());
        index.unIndex(student);
        indexService.saveClassAdditionIndex(index);

        final StudentsGradeIndex gradeIndex = indexService.getGradeIndex(student.getOwner());
        gradeIndex.unIndex(student);
        indexService.saveGradeIndex(gradeIndex);
    }
}
