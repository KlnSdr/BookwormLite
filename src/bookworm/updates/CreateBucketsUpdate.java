package bookworm.updates;

import bookworm.books.service.BooksService;
import bookworm.students.service.StudentsService;
import hades.update.Update;
import thot.connector.Connector;

public class CreateBucketsUpdate implements Update {
    @Override
    public boolean run() {
        final String[] bucketNames = new String[]{BooksService.BUCKET_NAME, StudentsService.BUCKET_NAME};

        for (String bucketName : bucketNames) {
            if (!Connector.write(bucketName, "TEST", "") || !Connector.delete(bucketName, "TEST")) {
                return false;
            }
        }

        return true;
    }

    @Override
    public String getName() {
        return "Bookworm_CreateBuckets";
    }

    @Override
    public int getOrder() {
        return UpdateOrder.CREATE_BUCKETS.getOrder();
    }
}
