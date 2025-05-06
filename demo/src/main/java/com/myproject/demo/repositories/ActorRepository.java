package com.myproject.demo.repositories;

import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import com.myproject.demo.models.Actor;

public interface ActorRepository extends MongoRepository<Actor, ObjectId> {
    Optional<Actor> findByName(String name);
    Optional<Actor> findById(String id);
}