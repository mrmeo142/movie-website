package com.myproject.demo.controllers;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.myproject.demo.models.Review;
import com.myproject.demo.services.ReviewService;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {
    @Autowired
    public ReviewService reviewService;

    @PostMapping
    public ResponseEntity<Review> createReview(@RequestBody Map<String, String> payload) {       
        return new ResponseEntity<>(reviewService.createReview(payload.get("body"), payload.get("imdbId")), HttpStatus.CREATED);
    }

    @GetMapping("/{imdbId}")
    public ResponseEntity<List<Review>> getReviews(@PathVariable String imdbId) {
        return new ResponseEntity<>(reviewService.getReviewsByImdbId(imdbId), HttpStatus.OK);
    }
}