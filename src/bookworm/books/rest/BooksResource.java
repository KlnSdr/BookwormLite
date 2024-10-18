package bookworm.books.rest;

import bookworm.books.Book;
import bookworm.books.BookUsageType;
import bookworm.books.StudentBook;
import bookworm.books.service.BooksService;
import bookworm.books.service.StudentBookAssociationService;
import dobby.annotations.Delete;
import dobby.annotations.Get;
import dobby.annotations.Post;
import dobby.annotations.Put;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

public class BooksResource {
    private static final BooksService service = BooksService.getInstance();
    private static final StudentBookAssociationService assocService = StudentBookAssociationService.getInstance();
    private static final String BASE_PATH = "/rest/books";

    @Get(BASE_PATH + "/id/{id}")
    public void getBookById(HttpContext context) {
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

        final Book book = service.find(uuid);

        if (book == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson payload = new NewJson();
            payload.setString("error", "Book not found");
            context.getResponse().setBody(payload);
            return;
        }

        context.getResponse().setBody(book.toJson());
    }

    @Get(BASE_PATH + "/id/{id}/demand")
    public void getDemandForBook(HttpContext context) {
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

        final Book book = service.find(uuid);

        if (book == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson payload = new NewJson();
            payload.setString("error", "Book not found");
            context.getResponse().setBody(payload);
            return;
        }

        final StudentBook[] studentBooks = assocService.getUsageOfBook(uuid);

        if (studentBooks == null) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson payload = new NewJson();
            payload.setString("error", "Failed to get student book associations");
            context.getResponse().setBody(payload);
            return;
        }

        final StudentBook[] buyBooks = Arrays.stream(studentBooks).filter(sb -> sb.getUsageType() == BookUsageType.BUY).toArray(StudentBook[]::new);
        final StudentBook[] borrowBooks = Arrays.stream(studentBooks).filter(sb -> sb.getUsageType() == BookUsageType.BORROW).toArray(StudentBook[]::new);

        final NewJson payload = new NewJson();
        payload.setInt("demandBuy", buyBooks.length);
        payload.setInt("demandBorrow", borrowBooks.length);

        context.getResponse().setBody(payload);
    }

    @Post(BASE_PATH)
    public void createBook(HttpContext context) {
        final NewJson body = context.getRequest().getBody();

        if (!verifyCreateRequest(body)) {
            context.getResponse().setCode(ResponseCodes.BAD_REQUEST);
            final NewJson payload = new NewJson();
            payload.setString("error", "Invalid request body");
            context.getResponse().setBody(payload);
            return;
        }

        final Book book = new Book();
        book.setName(body.getString("name"));
        book.setPrice(body.getFloat("price"));

        final List<Object> grades = body.getList("grades");
        book.setGrades(grades.stream().map(o -> (int) o).collect(Collectors.toList()));

        book.setApplyFee(body.getBoolean("applyFee"));
        book.setForGem(body.getBoolean("forGem"));

        book.setStock(body.getInt("stock"));

        if (!service.save(book)) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson payload = new NewJson();
            payload.setString("error", "Failed to save book");
            context.getResponse().setBody(payload);
            return;
        }

        context.getResponse().setCode(ResponseCodes.CREATED);
        context.getResponse().setBody(book.toJson());
        context.getResponse().setHeader("Location", BASE_PATH + "/id/" + book.getId());
    }

    @Put(BASE_PATH + "/id/{id}")
    public void updateBook(HttpContext context) {
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

        final Book book = service.find(uuid);

        if (book == null) {
            context.getResponse().setCode(ResponseCodes.NOT_FOUND);
            final NewJson payload = new NewJson();
            payload.setString("error", "Book not found");
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

        book.setName(body.getString("name"));
        book.setPrice(body.getFloat("price"));

        final List<Object> grades = body.getList("grades");
        book.setGrades(grades.stream().map(o -> (int) o).collect(Collectors.toList()));

        book.setApplyFee(body.getBoolean("applyFee"));
        book.setForGem(body.getBoolean("forGem"));
        book.setStock(body.getInt("stock"));

        if (!service.save(book)) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson payload = new NewJson();
            payload.setString("error", "Failed to save book");
            context.getResponse().setBody(payload);
            return;
        }

        context.getResponse().setCode(ResponseCodes.OK);
        context.getResponse().setBody(book.toJson());
        context.getResponse().setHeader("Location", BASE_PATH + "/id/" + book.getId());
    }

    @Delete(BASE_PATH + "/id/{id}")
    public void deleteBook(HttpContext context) {
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

        if (!service.delete(uuid)) {
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            final NewJson payload = new NewJson();
            payload.setString("error", "Failed to delete book");
            context.getResponse().setBody(payload);
            return;
        }

        context.getResponse().setCode(ResponseCodes.NO_CONTENT);
    }

    @Get(BASE_PATH + "/{type}/grade/{grade}")
    public void getBooksForGrade(HttpContext context) {
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

        final List<Book> books = service.getForGrade(grade, isGem);

        final NewJson payload = new NewJson();
        payload.setList("books", books.stream().map(Book::toJson).collect(Collectors.toList()));

        context.getResponse().setBody(payload);
    }

    private boolean verifyCreateRequest(NewJson body) {
        return body.hasKeys("name", "price", "grades", "applyFee", "forGem", "stock");
    }
}
