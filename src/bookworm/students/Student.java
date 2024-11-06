package bookworm.students;

import bookworm.students.service.StudentsService;
import dobby.util.json.NewJson;
import janus.DataClass;
import janus.annotations.JanusBoolean;
import janus.annotations.JanusInteger;
import janus.annotations.JanusString;
import janus.annotations.JanusUUID;
import thot.annotations.Bucket;

import java.util.UUID;

@Bucket(StudentsService.BUCKET_NAME)
public class Student implements DataClass {
    @JanusInteger("grade")
    private int grade;
    @JanusString("classAddition")
    private String classAddition;
    @JanusBoolean("isGem")
    private boolean isGem;
    @JanusInteger("fee")
    private int fee;
    @JanusString("name")
    private String name;
    @JanusUUID("id")
    private final UUID id;
    @JanusUUID("owner")
    private UUID owner;
    @JanusInteger("billEur")
    private int billEur;
    @JanusInteger("billCts")
    private int billCts;
    @JanusInteger("eBookLicenseEur")
    private int eBookLicenseEur;
    @JanusInteger("eBookLicenseCts")
    private int eBookLicenseCts;

    public Student() {
        this.id = UUID.randomUUID();
    }

    public float getBill() {
        return billEur + billCts / 100f;
    }

    public void setBill(double bill) {
        this.billEur = (int) bill;
        this.billCts = (int) ((bill - billEur) * 100);
    }

    public float getEBookLicense() {
        return eBookLicenseEur + eBookLicenseCts / 100f;
    }

    public void setEBookLicense(double eBookLicense) {
        this.eBookLicenseEur = (int) eBookLicense;
        this.eBookLicenseCts = (int) ((eBookLicense - eBookLicenseEur) * 100);
    }

    public int getGrade() {
        return grade;
    }

    public void setGrade(int grade) {
        this.grade = grade;
    }

    public String getClassAddition() {
        return classAddition;
    }

    public void setClassAddition(String classAddition) {
        this.classAddition = classAddition;
    }

    public boolean isGem() {
        return isGem;
    }

    public void setGem(boolean isGem) {
        this.isGem = isGem;
    }

    public int getFee() {
        return fee;
    }

    public void setFee(int fee) {
        this.fee = fee;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public UUID getId() {
        return id;
    }

    public UUID getOwner() {
        return owner;
    }

    public void setOwner(UUID owner) {
        this.owner = owner;
    }

    @Override
    public String getKey() {
        return  owner.toString() + "_" + id.toString();
    }

    @Override
    public NewJson toJson() {
        final NewJson json = new NewJson();
        json.setInt("grade", grade);
        json.setString("classAddition", classAddition);
        json.setBoolean("isGem", isGem);
        json.setInt("fee", fee);
        json.setString("name", name);
        json.setString("id", id.toString());
        json.setFloat("eBookLicense", getEBookLicense());
        json.setFloat("bill", getBill());
        return json;
    }

    public NewJson toStoreJson() {
        final NewJson json = new NewJson();
        json.setInt("grade", grade);
        json.setString("classAddition", classAddition);
        json.setString("isGem", isGem ? "true" : "false");
        json.setInt("fee", fee);
        json.setString("name", name);
        json.setString("id", id.toString());
        json.setString("owner", owner.toString());
        json.setInt("eBookLicenseEur", eBookLicenseEur);
        json.setInt("eBookLicenseCts", eBookLicenseCts);
        json.setInt("billEur", billEur);
        json.setInt("billCts", billCts);
        return json;
    }
}
