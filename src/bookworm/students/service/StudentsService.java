package bookworm.students.service;

import bookworm.students.Student;
import dobby.util.json.NewJson;
import janus.Janus;
import thot.connector.Connector;

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

    public Student find(UUID id) {
        return Janus.parse(Connector.read(BUCKET_NAME, id.toString(), NewJson.class), Student.class);
    }

    public void save(Student student) {
        Connector.write(BUCKET_NAME, student.getId().toString(), student.toStoreJson());
    }

    public void delete(UUID id) {
        Connector.delete(BUCKET_NAME, id.toString());
    }

    public Student getForGrade(int grade, boolean isGem) {
        final NewJson[] allStudents = Connector.readPattern(BUCKET_NAME, ".*", NewJson.class);
        for (NewJson studentJson : allStudents) {
            final Student student = Janus.parse(studentJson, Student.class);
            if (student == null) {
                continue;
            }
            if (student.getGrade() == grade && student.isGem() == isGem) {
                return student;
            }
        }
        return null;
    }
}
