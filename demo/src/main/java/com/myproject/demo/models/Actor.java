package com.myproject.demo.models;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "actors")
@Data
@AllArgsConstructor
public class Actor {
    @Id
    private ObjectId id;
    private String name;
    private List<String> movies;
    private String nationality;
    private String birthDate;
    private String avatar;
    public Actor() {}

    public Actor(String name, List<String> movies, String nationality, String birthDate, String avatar) {
        this.name = name;
        this.movies = new ArrayList<>();
        this.nationality = nationality;
        this.birthDate = birthDate;
        this.avatar = avatar;
    }
    
}
