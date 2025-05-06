package com.myproject.demo.models;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import lombok.AllArgsConstructor;
import lombok.Data;

@Document(collection = "admins") 
@Data
@AllArgsConstructor
public class Admin {
    @Id
    private ObjectId id;
    private String username;
    private String password;
    public Admin() {}

    public Admin(String username, String password){
    this.username = username;
    this.password = password;
    }
}