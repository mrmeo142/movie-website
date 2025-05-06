package com.myproject.demo.models;

import java.util.ArrayList;
import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "data")
@Data
@AllArgsConstructor

public class Movie {
    @Id
    private ObjectId id;
    private String imdbId;
    private String title;
    private String releaseDate;
    private String trailerLink;
    private List<String> genres;
    private String poster;
    private List<String> backdrops;
    private ArrayList<String> movielink;
    private List<String> actors;
    public ArrayList<String> getMovieLink(){
        return movielink;       
    }
    public Movie() {}

    public Movie(String imdbId, String title, String releaseDate, String trailerLink, List<String> genres,
                 String poster, List<String> backdrops, List<String> movielink, List<String> actors) {
        this.imdbId = imdbId;
        this.title = title;
        this.releaseDate = releaseDate;
        this.trailerLink = trailerLink;
        this.genres = new ArrayList<>();
        this.poster = poster;
        this.backdrops = new ArrayList<>();
        this.movielink = new ArrayList<>();
        this.actors = new ArrayList<>();
    }
    
}
