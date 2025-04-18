package bookworm.updates;

public enum UpdateOrder {
    CREATE_BUCKETS(20),
    CREATE_INDEX(21);

    private final int order;

    UpdateOrder(int order) {
        this.order = order;
    }

    public int getOrder() {
        return order;
    }
}
