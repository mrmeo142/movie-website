package com.myproject.demo.repositories;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.myproject.demo.models.Review;
@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findByImdbId(String imdbId);
}
