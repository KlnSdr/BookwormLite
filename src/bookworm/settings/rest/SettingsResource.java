package bookworm.settings.rest;

import bookworm.books.Book;
import bookworm.books.StudentBookAssociation;
import bookworm.books.service.BooksService;
import bookworm.books.service.StudentBookAssociationService;
import bookworm.index.service.IndexService;
import bookworm.students.Student;
import bookworm.students.service.StudentsService;
import dobby.annotations.Delete;
import dobby.annotations.Get;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;
import dobby.util.logging.Logger;
import hades.annotations.AuthorizedOnly;

import java.util.Arrays;
import java.util.UUID;

public class SettingsResource {
    private static final Logger LOGGER = new Logger(SettingsResource.class);
    private static final String BASE_PATH = "/rest/settings";
    private static final BooksService bookService = BooksService.getInstance();
    private static final StudentsService studentsService = StudentsService.getInstance();
    private static final StudentBookAssociationService assocService = StudentBookAssociationService.getInstance();
    private static final IndexService indexService = IndexService.getInstance();

    @AuthorizedOnly
    @Delete(BASE_PATH + "/all-data")
    public void deleteAllData(HttpContext context) {
        LOGGER.warn("deleting all data");

        final UUID userId = getUserId(context);

        final boolean success = assocService.deleteAll(userId)
                && bookService.deleteAll(userId)
                && studentsService.deleteAll(userId)
                && indexService.dropClassAdditionIndex(indexService.getClassAdditionIndex(userId))
                && indexService.dropGradeIndex(indexService.getGradeIndex(userId));

        if (!success) {
            final NewJson payload = new NewJson();
            payload.setString("msg", "Data may be only partially deleted.");
            context.getResponse().setBody(payload);
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            return;
        }

        context.getResponse().setCode(ResponseCodes.NO_CONTENT);
    }

    @AuthorizedOnly
    @Get(BASE_PATH + "/backup")
    public void createBackupOfData(HttpContext context) {
        final Book[] books = bookService.getAll(getUserId(context));
        final Student[] students = studentsService.getAll(getUserId(context));
        final StudentBookAssociation[] assocs = assocService.getAll(getUserId(context));

        final NewJson payload = new NewJson();
        payload.setList("books", Arrays.stream(books).toList().stream().map(e -> (Object) e.toJson()).toList());
        payload.setList("students", Arrays.stream(students).toList().stream().map(e -> (Object) e.toJson()).toList());
        payload.setList("associations", Arrays.stream(assocs).toList().stream().map(e -> (Object) e.toJson()).toList());

        context.getResponse().setBody(payload);
    }

    private UUID getUserId(HttpContext context) {
        return UUID.fromString(context.getSession().get("userId"));
    }
}
