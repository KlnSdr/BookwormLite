package bookworm.index;

import dobby.util.json.NewJson;
import common.logger.Logger;

import java.util.HashSet;
import java.util.List;

public abstract class IntegerDatabaseIndex<T> extends DatabaseIndex<Integer, T> {
    private static final Logger LOGGER = new Logger(IntegerDatabaseIndex.class);

    @Override
    public NewJson toJson() {
        final NewJson json = new NewJson();

        for (Integer key : keys.keySet()) {
            final List<String> values = keys.get(key).stream().toList();
            json.setList(key.toString(), values.stream().map(s -> (Object)s).toList());
        }

        final List<Integer> keysList = keys.keySet().stream().toList();
        json.setList("index_keys", keysList.stream().map(s -> (Object)s).toList());

        return json;
    }

    @Override
    public void fromJson(NewJson json) {
        keys.clear();

        if (!validateJson(json)) {
            LOGGER.error("Invalid JSON for index");
            return;
        }

        final List<String> keysList = json.getList("index_keys").stream().map(Object::toString).toList();
        for (String key : keysList) {
            final List<String> values = json.getList(key).stream().map(Object::toString).toList();
            keys.put(Integer.parseInt(key), new HashSet<>(values));
        }
    }

    private boolean validateJson(NewJson json) {
        if (!json.hasKey("index_keys")) {
            return false;
        }

        final List<String> keysList = json.getList("index_keys").stream().map(Object::toString).toList();
        for (String key : keysList) {
            if (!json.hasKey(key)) {
                return false;
            }
        }
        return true;
    }
}
