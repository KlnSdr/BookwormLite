package bookworm.index;

import dobby.util.json.NewJson;
import thot.janus.DataClass;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

public abstract class DatabaseIndex<K, T> implements DataClass {
    protected Map<K, Set<String>> keys;

    public DatabaseIndex() {
        keys = new HashMap<>();
    }

    public abstract void index(T object);
    public abstract void unIndex(T object);

    public void setFor(K key, Set<String> values) {
        keys.put(key, values);
    }

    public void add(K key, String value) {
        if (!keys.containsKey(key)) {
            keys.put(key, new HashSet<>());
        }
        keys.get(key).add(value);
    }

    public Set<String> getFor(K key) {
        if (!keys.containsKey(key)) {
            return new HashSet<>();
        }
        return keys.get(key);
    }

    public Map<K, Set<String>> getAll() {
        return keys;
    }

    public void drop(K key) {
        keys.remove(key);
    }

    public void dropAll() {
        keys.clear();
    }

    public void remove(K key, String value) {
        if (!keys.containsKey(key)) {
            return;
        }
        keys.get(key).remove(value);
    }

    public abstract NewJson toJson();
    public abstract void fromJson(NewJson json);
}
