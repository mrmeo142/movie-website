package com.myproject.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.myproject.demo.models.Review;
import com.myproject.demo.repositories.ReviewRepository;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review createReview(String body, String imdbId) {
        return reviewRepository.save(new Review(body, imdbId));
    }

    public List<Review> getReviewsByImdbId(String imdbId) {
        return reviewRepository.findByImdbId(imdbId);
    }
}



