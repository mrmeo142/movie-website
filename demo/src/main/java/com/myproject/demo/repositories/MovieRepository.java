package com.myproject.demo.repositories;

import java.util.List;
import java.util.Optional;

import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.myproject.demo.models.Movie;

@Repository
public interface MovieRepository extends MongoRepository<Movie, ObjectId> {
    Optional<Movie> findMovieByImdbId(String imdbId);
    List<Movie> findByImdbIdIn(List<String> imdbIds);
    List<Movie> findByTitleContainingIgnoreCase(String title);
}
