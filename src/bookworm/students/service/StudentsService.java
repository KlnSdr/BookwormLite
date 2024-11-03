package bookworm.students.service;

import bookworm.students.Student;
import dobby.util.json.NewJson;
import janus.Janus;
import thot.connector.Connector;

import java.util.ArrayList;
import java.util.UUID;

public class StudentsService {
    public static final String BUCKET_NAME = "bookworm_students";

    private static StudentsService instance;

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
        return Connector.write(BUCKET_NAME, student.getKey(), student.toStoreJson());
    }

    public boolean delete(UUID owner, UUID id) {
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
        final NewJson[] allStudents = Connector.readPattern(BUCKET_NAME, owner + "_.*", NewJson.class);
        final ArrayList<Student> students = new ArrayList<>();
        for (NewJson studentJson : allStudents) {
            final Student student = Janus.parse(studentJson, Student.class);
            if (student == null) {
                continue;
            }
            students.add(student);
        }
        return students.toArray(new Student[0]);
    }

    public Student[] getForGrade(UUID owner, int grade, boolean isGem) {
        final ArrayList<Student> students = new ArrayList<>();
        for (Student student: getAll(owner)) {
            if (student.getGrade() == grade && student.isGem() == isGem) {
                students.add(student);
            }
        }
        return students.toArray(new Student[0]);
    }

    public Student[] getForGradeAndClassAddition(UUID owner, int grade, String classAddition, boolean isGem) {
        final ArrayList<Student> students = new ArrayList<>();
        for (Student student: getAll(owner)) {
            if (student.getGrade() == grade && student.isGem() == isGem && student.getClassAddition().equalsIgnoreCase(classAddition)) {
                students.add(student);
            }
        }
        return students.toArray(new Student[0]);
    }
}
