package bookworm.students.rest;

import bookworm.students.Student;
import bookworm.students.service.StudentsService;
import dobby.annotations.Delete;
import dobby.annotations.Get;
import dobby.annotations.Post;
import dobby.annotations.Put;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;

import java.util.UUID;

public class StudentResource {
    private static final StudentsService service = StudentsService.getInstance();
    private static final String BASE_PATH = "/students";

    @Get(BASE_PATH + "/{id}")
    public void getStudentById(HttpContext context) {
        final String id = context.getRequest().getParam("id");
        UUID uuid;

        try {
            uuid = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            uuid = null;
        }

        if (uuid == null) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson payload = new NewJson();
            payload.setString("error", "No id provided");
            context.getResponse().setBody(payload);
            return;
        }

        final Student student = service.find(uuid);

        if (student == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson payload = new NewJson();
            payload.setString("error", "Student not found");
            context.getResponse().setBody(payload);
            return;
        }

        context.getResponse().setBody(student.toJson());
    }

    @Post(BASE_PATH)
    public void createStudent(HttpContext context) {
        final NewJson body = context.getRequest().getBody();

        if (!verifyCreateRequest(body)) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson payload = new NewJson();
            payload.setString("error", "Invalid request body");
            context.getResponse().setBody(payload);
            return;
        }

        final Student student = new Student();
        student.setGrade(body.getInt("grade"));
        student.setClassAddition(body.getString("classAddition"));
        student.setGem(body.getBoolean("isGem"));
        student.setFee(body.getInt("fee"));
        student.setName(body.getString("name"));

        final boolean success = service.save(student);

        if (!success) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson payload = new NewJson();
            payload.setString("error", "Failed to save student");
            context.getResponse().setBody(payload);
            return;
        }

        context.getResponse().setCode(ResponseCodes.CREATED);
        context.getResponse().setHeader("Location", BASE_PATH + "/" + student.getId());
        context.getResponse().setBody(student.toJson());
    }

    @Put(BASE_PATH + "/{id}")
    public void updateStudent(HttpContext context) {
        final String id = context.getRequest().getParam("id");
        UUID uuid;

        try {
            uuid = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            uuid = null;
        }

        if (uuid == null) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson payload = new NewJson();
            payload.setString("error", "No id provided");
            context.getResponse().setBody(payload);
            return;
        }

        final Student student = service.find(uuid);

        if (student == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson payload = new NewJson();
            payload.setString("error", "Student not found");
            context.getResponse().setBody(payload);
            return;
        }

        final NewJson body = context.getRequest().getBody();

        if (!verifyCreateRequest(body)) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson payload = new NewJson();
            payload.setString("error", "Invalid request body");
            context.getResponse().setBody(payload);
            return;
        }

        student.setGrade(body.getInt("grade"));
        student.setClassAddition(body.getString("classAddition"));
        student.setGem(body.getBoolean("isGem"));
        student.setFee(body.getInt("fee"));
        student.setName(body.getString("name"));

        final boolean success = service.save(student);

        if (!success) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson payload = new NewJson();
            payload.setString("error", "Failed to save student");
            context.getResponse().setBody(payload);
            return;
        }

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(student.toJson());
        context.getResponse().setHeader("Location", BASE_PATH + "/" + student.getId());
    }

    @Delete(BASE_PATH + "/{id}")
    public void deleteStudent(HttpContext context) {
        final String id = context.getRequest().getParam("id");
        UUID uuid;

        try {
            uuid = UUID.fromString(id);
        } catch (IllegalArgumentException e) {
            uuid = null;
        }

        if (uuid == null) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson payload = new NewJson();
            payload.setString("error", "No id provided");
            context.getResponse().setBody(payload);
            return;
        }

        final Student student = service.find(uuid);

        if (student == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson payload = new NewJson();
            payload.setString("error", "Student not found");
            context.getResponse().setBody(payload);
            return;
        }

        final boolean success = service.delete(uuid);

        if (!success) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson payload = new NewJson();
            payload.setString("error", "Failed to delete student");
            context.getResponse().setBody(payload);
            return;
        }

        context.getResponse().setCode(ResponseCodes.NO_CONTENT);
    }

    private boolean verifyCreateRequest(NewJson body) {
        return body.hasKeys("grade", "classAddition", "isGem", "fee", "name");
    }
}
