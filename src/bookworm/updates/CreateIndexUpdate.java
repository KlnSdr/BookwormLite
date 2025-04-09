package bookworm.updates;

import bookworm.index.service.IndexService;
import bookworm.students.Student;
import bookworm.students.StudentsClassAdditionIndex;
import bookworm.students.StudentsGradeIndex;
import bookworm.students.service.StudentsService;
import dobby.util.json.NewJson;
import common.logger.Logger;
import hades.update.Update;
import hades.user.User;
import hades.user.service.UserService;
import thot.connector.Connector;
import thot.janus.Janus;

import java.util.ArrayList;
import java.util.List;

public class CreateIndexUpdate implements Update {
    private static final Logger LOGGER = new Logger(CreateIndexUpdate.class);
    @Override
    public boolean run() {
        if (!createBuckets()) {
            return false;
        }

        final User[] users = UserService.getInstance().findAll();

        for (User user : users) {
            LOGGER.info("Creating index for user: " + user.getId());
            if (!createIndexForUser(user)) {
                return false;
            }
        }

        return true;
    }

    private boolean createIndexForUser(User user) {
        final NewJson[] studentsJson = Connector.readPattern(StudentsService.BUCKET_NAME, user.getId() + "_.*", NewJson.class);
        final List<Student> students = new ArrayList<>();
        for (NewJson studentJson : studentsJson) {
            final Student student = Janus.parse(studentJson, Student.class);
            if (student != null) {
                students.add(student);
            }
        }

        final StudentsClassAdditionIndex classAdditionIndex = new StudentsClassAdditionIndex(user.getId());
        final StudentsGradeIndex gradeIndex = new StudentsGradeIndex(user.getId());

        for (Student student : students) {
            classAdditionIndex.index(student);
            gradeIndex.index(student);
        }

        IndexService.getInstance().saveClassAdditionIndex(classAdditionIndex);
        IndexService.getInstance().saveGradeIndex(gradeIndex);

        return true;
    }

    private boolean createBuckets() {
        final String[] bucketNames = {IndexService.CLASS_ADDITION_INDEX_BUCKET_NAME, IndexService.GRADE_INDEX_BUCKET_NAME};

        for (String bucketName : bucketNames) {
            if (!Connector.write(bucketName, "TEST", "") || !Connector.delete(bucketName, "TEST")) {
                return false;
            }
        }
        return true;
    }

    @Override
    public String getName() {
        return "bookworm_CreateIndexUpdate";
    }

    @Override
    public int getOrder() {
        return UpdateOrder.CREATE_INDEX.getOrder();
    }
}
