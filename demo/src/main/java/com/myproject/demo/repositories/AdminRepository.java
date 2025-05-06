package com.myproject.demo.repositories;

import com.myproject.demo.models.Admin;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AdminRepository extends MongoRepository<Admin, ObjectId> {
    Optional<Admin> findByUsername(String username); 
}