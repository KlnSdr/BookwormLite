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
    private UUID id;

    public Student() {
        this.id = UUID.randomUUID();
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

    @Override
    public String getKey() {
        return id.toString();
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
        return json;
    }
}
