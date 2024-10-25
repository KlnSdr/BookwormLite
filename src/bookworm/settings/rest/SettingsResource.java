package bookworm.settings.rest;

import bookworm.books.service.BooksService;
import bookworm.books.service.StudentBookAssociationService;
import bookworm.students.service.StudentsService;
import dobby.annotations.Delete;
import dobby.io.HttpContext;
import dobby.io.response.ResponseCodes;
import dobby.util.json.NewJson;
import dobby.util.logging.Logger;

public class SettingsResource {
    private static final Logger LOGGER = new Logger(SettingsResource.class);
    private static final String BASE_PATH = "/rest/settings";
    private static final BooksService bookService = BooksService.getInstance();
    private static final StudentsService studentsService = StudentsService.getInstance();
    private static final StudentBookAssociationService assocService = StudentBookAssociationService.getInstance();

    @Delete(BASE_PATH + "/all-data")
    public void deleteAllData(HttpContext context) {
        LOGGER.warn("deleting all data");

        final boolean success = assocService.deleteAll() && bookService.deleteAll() && studentsService.deleteAll();

        if (!success) {
            final NewJson payload = new NewJson();
            payload.setString("msg", "Data may be only partially deleted.");
            context.getResponse().setBody(payload);
            context.getResponse().setCode(ResponseCodes.INTERNAL_SERVER_ERROR);
            return;
        }

        context.getResponse().setCode(ResponseCodes.NO_CONTENT);
    }
}
