package com.myproject.demo.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "comments")
@Data
@AllArgsConstructor
public class Review {
    @Id
    private String id;
    private String imdbId;
    private String body;

    public Review() {}
    public Review(String body, String imdbId) {
        this.body = body;
        this.imdbId = imdbId;
    }

    public String getId() { return id; }
    public String getBody() { return body; }
    public void setBody(String body) { this.body = body; }
    public String getImdbId() { return imdbId; }
    public void setImdbId(String imdbId) { this.imdbId = imdbId; }
}
