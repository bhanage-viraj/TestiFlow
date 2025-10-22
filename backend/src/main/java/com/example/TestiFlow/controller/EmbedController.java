package com.example.TestiFlow.controller;

import com.example.TestiFlow.dto.ReviewDto; // Import DTO
import com.example.TestiFlow.model.Review; // Remove this if no longer needed
import com.example.TestiFlow.service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/embed")
public class EmbedController {

    @Autowired
    private ReviewService reviewService;

    // UPDATE: ResponseEntity<List<Review>> to ResponseEntity<List<ReviewDto>>
    @GetMapping("/{spaceId}")
    public ResponseEntity<List<ReviewDto>> getLikedReviewsForEmbed(@PathVariable String spaceId) {
        // Service now returns List<ReviewDto>
        List<ReviewDto> reviews = reviewService.getLikedReviews(spaceId);
        return ResponseEntity.ok(reviews);
    }
}