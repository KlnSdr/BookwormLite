package bookworm.evaluation.rest;

import bookworm.books.StudentBook;
import bookworm.books.service.StudentBookAssociationService;
import bookworm.students.Student;
import bookworm.students.service.StudentsService;
import dobby.annotations.Get;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;

import java.util.ArrayList;

public class EvaluationResource {
    private static final String BASE_PATH = "/rest/evaluation";
    private static final StudentsService studentService = StudentsService.getInstance();
    private static final StudentBookAssociationService assocService = StudentBookAssociationService.getInstance();

    @Get(BASE_PATH + "/{type}/grade/{grade}/financial-data")
    public void getFinancialDataForGrade(HttpContext context) {
        final String schoolType = context.getRequest().getParam("type");
        final boolean isGem = schoolType.equalsIgnoreCase("gem");

        if (!(schoolType.equalsIgnoreCase("gem") || schoolType.equalsIgnoreCase("gym"))) {
            final NewJson payload = new NewJson();
            payload.setString("msg", "Invalid school form.");

            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            context.getResponse().setBody(payload);
            return;
        }

        final String stringGrade = context.getRequest().getParam("grade");
        final int grade;
        try {
            grade = Integer.parseInt(stringGrade);
        } catch (Exception e) {
            final NewJson payload = new NewJson();
            payload.setString("msg", "Could not transform provided grade to int.");

            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            context.getResponse().setBody(payload);
            return;
        }

        final Student[] students = studentService.getForGrade(grade, isGem);
        double sumBorrow = 0.0;
        double sumBuy = 0.0;
        double sumEBookLicense = 0.0;
        double sumBill = 0.0;

        for (Student student : students) {
            final StudentBook[] booksOfStudent = assocService.getBooksForStudent(student.getId());
            for (StudentBook book : booksOfStudent) {
                switch (book.getUsageType()) {
                    case BUY -> sumBuy += book.getBook().getPrice();
                    case BORROW -> sumBorrow += book.getBook().isApplyFee() ? student.getFee() : 0.0;
                }
            }
            sumEBookLicense += student.getEBookLicense();
            sumBill += student.getBill();
        }

        final NewJson payload = new NewJson();
        payload.setFloat("borrow", sumBorrow);
        payload.setFloat("buy", sumBuy);
        payload.setFloat("eBook", sumEBookLicense);
        payload.setFloat("bill", sumBill);
        payload.setInt("studentCount", students.length);

        context.getResponse().setBody(payload);
    }

    @Get(BASE_PATH + "/{type}/grade/{grade}/students")
    public void getStudentEvaluation(HttpContext context) {
        final String schoolType = context.getRequest().getParam("type");
        final boolean isGem = schoolType.equalsIgnoreCase("gem");

        if (!(schoolType.equalsIgnoreCase("gem") || schoolType.equalsIgnoreCase("gym"))) {
            final NewJson payload = new NewJson();
            payload.setString("msg", "Invalid school form.");

            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            context.getResponse().setBody(payload);
            return;
        }

        final String stringGrade = context.getRequest().getParam("grade");
        final int grade;
        try {
            grade = Integer.parseInt(stringGrade);
        } catch (Exception e) {
            final NewJson payload = new NewJson();
            payload.setString("msg", "Could not transform provided grade to int.");

            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            context.getResponse().setBody(payload);
            return;
        }

        final Student[] students = studentService.getForGrade(grade, isGem);
        final ArrayList<NewJson> responseList = new ArrayList<>();

        for (Student student : students) {
            final StudentBook[] studentBooks = assocService.getBooksForStudent(student.getId());
            double sumBuy = 0.0;
            double sumBorrow = 0.0;
            final ArrayList<NewJson> bookInfo = new ArrayList<>();

            for (StudentBook book : studentBooks) {
                switch (book.getUsageType()) {
                    case BUY -> sumBuy += book.getBook().getPrice();
                    case BORROW -> sumBorrow += book.getBook().isApplyFee() ? student.getFee() : 0.0;
                }
                final NewJson bookJson = new NewJson();
                bookJson.setString("name", book.getBook().getName());
                bookJson.setString("type", book.getUsageType().toString());

                bookInfo.add(bookJson);
            }

            final NewJson studentJson = new NewJson();
            studentJson.setString("name", student.getName());
            studentJson.setString("classAddition", student.getClassAddition());
            studentJson.setFloat("sumBuy", sumBuy);
            studentJson.setFloat("sumBorrow", sumBorrow);
            studentJson.setFloat("eBook", student.getEBookLicense());
            studentJson.setFloat("bill", student.getBill());
            studentJson.setList("books", bookInfo.stream().map(e -> (Object) e).toList());

            responseList.add(studentJson);
        }

        final NewJson payload = new NewJson();
        payload.setList("students", responseList.stream().map(e -> (Object) e).toList());
        context.getResponse().setBody(payload);
        context.getResponse().setHeader("Content-Type", "application/json");
    }
}