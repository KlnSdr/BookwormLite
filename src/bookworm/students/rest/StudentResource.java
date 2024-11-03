package bookworm.students.rest;

import bookworm.books.BookUsageType;
import bookworm.books.StudentBook;
import bookworm.books.StudentBookAssociation;
import bookworm.books.service.StudentBookAssociationService;
import bookworm.students.Student;
import bookworm.students.service.StudentsService;
import dobby.annotations.Delete;
import dobby.annotations.Get;
import dobby.annotations.Post;
import dobby.annotations.Put;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;
import hades.annotations.AuthorizedOnly;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class StudentResource {
    private static final StudentsService studentService = StudentsService.getInstance();
    private static final StudentBookAssociationService associationService = StudentBookAssociationService.getInstance();
    private static final String BASE_PATH = "/rest/students";

    @AuthorizedOnly
    @Get(BASE_PATH + "/id/{id}")
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

        final Student student = studentService.find(getUserId(context), uuid);

        if (student == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson payload = new NewJson();
            payload.setString("error", "Student not found");
            context.getResponse().setBody(payload);
            return;
        }

        context.getResponse().setBody(student.toJson());
    }

    @AuthorizedOnly
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
        student.setEBookLicense(body.getInt("eBookLicense"));
        student.setBill(body.getInt("bill"));
        student.setOwner(getUserId(context));

        final boolean success = studentService.save(student);

        if (!success) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson payload = new NewJson();
            payload.setString("error", "Failed to save student");
            context.getResponse().setBody(payload);
            return;
        }

        context.getResponse().setCode(ResponseCodes.CREATED);
        context.getResponse().setHeader("Location", BASE_PATH + "/id/" + student.getId());
        context.getResponse().setBody(student.toJson());
    }

    @AuthorizedOnly
    @Put(BASE_PATH + "/id/{id}")
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

        final Student student = studentService.find(getUserId(context), uuid);

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
        student.setEBookLicense(body.getInt("eBookLicense"));
        student.setBill(body.getInt("bill"));

        final boolean success = studentService.save(student);

        if (!success) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson payload = new NewJson();
            payload.setString("error", "Failed to save student");
            context.getResponse().setBody(payload);
            return;
        }

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(student.toJson());
        context.getResponse().setHeader("Location", BASE_PATH + "/id/" + student.getId());
    }

    @AuthorizedOnly
    @Delete(BASE_PATH + "/id/{id}")
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

        final Student student = studentService.find(getUserId(context), uuid);

        if (student == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson payload = new NewJson();
            payload.setString("error", "Student not found");
            context.getResponse().setBody(payload);
            return;
        }

        final boolean success = studentService.delete(getUserId(context), uuid);

        if (!success) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson payload = new NewJson();
            payload.setString("error", "Failed to delete student");
            context.getResponse().setBody(payload);
            return;
        }

        context.getResponse().setCode(ResponseCodes.NO_CONTENT);
    }

    @AuthorizedOnly
    @Get(BASE_PATH + "/{type}/grade/{grade}")
    public void getAllByGrade(HttpContext context) {
        final String schoolType = context.getRequest().getParam("type");

        if (schoolType == null || (!schoolType.equalsIgnoreCase("gym") && !schoolType.equalsIgnoreCase("gem"))) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson payload = new NewJson();
            payload.setString("error", "Invalid school type");
            context.getResponse().setBody(payload);
            return;
        }

        final int grade;
        try {
            grade = Integer.parseInt(context.getRequest().getParam("grade"));
        } catch (NumberFormatException e) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson payload = new NewJson();
            payload.setString("error", "Invalid grade");
            context.getResponse().setBody(payload);
            return;
        }

        final boolean isGem = schoolType.equalsIgnoreCase("gem");

        final Student[] students = studentService.getForGrade(getUserId(context), grade, isGem);

        final NewJson payload = new NewJson();
        payload.setList("students", Arrays.stream(students).map(Student::toJson).collect(Collectors.toList()));

        context.getResponse().setBody(payload);
    }

    @AuthorizedOnly
    @Get(BASE_PATH + "/{type}/grade/{grade}/class/{classAddition}")
    public void getAllByGradeAndClassAddition(HttpContext context) {
        final String schoolType = context.getRequest().getParam("type");

        if (schoolType == null || (!schoolType.equalsIgnoreCase("gym") && !schoolType.equalsIgnoreCase("gem"))) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson payload = new NewJson();
            payload.setString("error", "Invalid school type");
            context.getResponse().setBody(payload);
            return;
        }

        final int grade;
        try {
            grade = Integer.parseInt(context.getRequest().getParam("grade"));
        } catch (NumberFormatException e) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson payload = new NewJson();
            payload.setString("error", "Invalid grade");
            context.getResponse().setBody(payload);
            return;
        }

        final String classAddition = context.getRequest().getParam("classAddition");

        final boolean isGem = schoolType.equalsIgnoreCase("gem");

        final Student[] students = studentService.getForGradeAndClassAddition(getUserId(context), grade, classAddition, isGem);

        final NewJson payload = new NewJson();
        payload.setList("students", Arrays.stream(students).map(Student::toJson).collect(Collectors.toList()));

        context.getResponse().setBody(payload);
    }

    @AuthorizedOnly
    @Get(BASE_PATH + "/id/{id}/books")
    public void getBooksForStudent(HttpContext context) {
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

        final Student student = studentService.find(getUserId(context), uuid);

        if (student == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson payload = new NewJson();
            payload.setString("error", "Student not found");
            context.getResponse().setBody(payload);
            return;
        }

        final StudentBook[] books = associationService.getBooksForStudent(getUserId(context), uuid);

        final NewJson payload = new NewJson();
        payload.setList("books", Arrays.stream(books).map(StudentBook::toJson).collect(Collectors.toList()));

        context.getResponse().setBody(payload);
    }

    @AuthorizedOnly
    @Put(BASE_PATH + "/id/{id}/books")
    public void setBooksForStudent(HttpContext context) {
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

        if (!verifyBookRequest(context.getRequest().getBody())) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson payload = new NewJson();
            payload.setString("error", "Invalid request body");
            context.getResponse().setBody(payload);
            return;
        }

        final Student student = studentService.find(getUserId(context), uuid);

        if (student == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson payload = new NewJson();
            payload.setString("error", "Student not found");
            context.getResponse().setBody(payload);
            return;
        }

        final List<Object> bookData = context.getRequest().getBody().getList("books");
        final List<StudentBookAssociation> booksToStore = new ArrayList<>();
        for (Object book : bookData) {
            final NewJson bookJson = (NewJson) book;
            final UUID bookId = UUID.fromString(bookJson.getString("id"));
            final String bookType = bookJson.getString("type");
            final StudentBookAssociation association = new StudentBookAssociation(getUserId(context), student.getId(), bookId, BookUsageType.fromString(bookType));
            if (association.getType() == BookUsageType.UNKNOWN) {
                sendMalformedRequestResponse(context);
                return;
            }
            booksToStore.add(association);
        }

        for (StudentBookAssociation association : booksToStore) {
            final boolean didStore = associationService.save(association);
            if (!didStore) {
                sendPartialStoreResponse(context);
                return;
            }
        }
    }

    private boolean verifyCreateRequest(NewJson body) {
        return body.hasKeys("grade", "classAddition", "isGem", "fee", "name", "eBookLicense", "bill");
    }

    private boolean verifyBookRequest(NewJson body) {
        if (!body.hasKey("books")) {
            return false;
        }

        final List<Object> bookData = body.getList("books");
        for (Object book : bookData) {
            if (!(book instanceof NewJson)) {
                return false;
            }

            final NewJson bookJson = (NewJson) book;

            if (!bookJson.hasKeys("id", "type")) {
                return false;
            }
        }

        return true;
    }

    private void sendMalformedRequestResponse(HttpContext context) {
        final NewJson payload = new NewJson();
        payload.setString("msg", "Malformed request object");

        context.getResponse().setBody(payload);
        context.getResponse().setCode(ResponseCodes.UNPROCESSABLE_ENTITY);
    }

    private void sendPartialStoreResponse(HttpContext context) {
        final NewJson payload = new NewJson();
        payload.setString("msg", "Data could only partially be stored");

        context.getResponse().setBody(payload);
        context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
    }

    private UUID getUserId(HttpContext context) {
        return UUID.fromString(context.getSession().get("userId"));
    }
}
