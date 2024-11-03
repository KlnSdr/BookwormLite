package bookworm.books;

import bookworm.books.service.BooksService;
import dobby.util.json.NewJson;
import janus.DataClass;
import janus.annotations.*;
import thot.annotations.Bucket;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Bucket(BooksService.BUCKET_NAME)
public class Book implements DataClass {
    @JanusString("name")
    private String name;
    @JanusInteger("priceEur")
    private int priceEur;
    @JanusInteger("priceCts")
    private int priceCts;
    @JanusInteger("stock")
    private int stock;
    @JanusList("grades")
    private List<Integer> grades;
    @JanusBoolean("applyFee")
    private boolean applyFee;
    @JanusBoolean("forGem")
    private boolean forGem;
    @JanusUUID("id")
    private UUID id;
    @JanusUUID("owner")
    private UUID owner;


    public Book() {
        this.id = UUID.randomUUID();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public float getPrice() {
        return priceEur + priceCts / 100f;
    }

    public void setPrice(double price) {
        this.priceEur = (int) price;
        this.priceCts = (int) ((price - priceEur) * 100);
    }

    public List<Integer> getGrades() {
        return grades;
    }

    public void setGrades(List<Integer> grades) {
        this.grades = grades;
    }

    public boolean isApplyFee() {
        return applyFee;
    }

    public void setApplyFee(boolean applyFee) {
        this.applyFee = applyFee;
    }

    public boolean isForGem() {
        return forGem;
    }

    public void setForGem(boolean forGem) {
        this.forGem = forGem;
    }

    public UUID getId() {
        return id;
    }

    public void setOwner(UUID owner) {
        this.owner = owner;
    }

    public UUID getOwner() {
        return owner;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }

    @Override
    public String getKey() {
        return owner.toString() + "_" + id.toString();
    }

    @Override
    public NewJson toJson() {
        final NewJson json = new NewJson();
        json.setString("name", name);
        json.setString("price", priceEur + "." + priceCts);
        json.setList("grades", new ArrayList<>(grades));
        json.setBoolean("applyFee", applyFee);
        json.setBoolean("forGem", forGem);
        json.setString("id", id.toString());
        json.setInt("stock", stock);
        return json;
    }

    public NewJson toStoreJson() {
        final NewJson json = new NewJson();
        json.setString("name", name);
        json.setInt("priceEur", priceEur);
        json.setInt("priceCts", priceCts);
        json.setList("grades", grades.stream().map(o -> (Object) o).collect(Collectors.toList()));
        json.setString("applyFee", applyFee ? "true" : "false");
        json.setString("forGem", forGem ? "true" : "false");
        json.setString("id", id.toString());
        json.setString("owner", owner.toString());
        json.setInt("stock", stock);
        return json;
    }
}
