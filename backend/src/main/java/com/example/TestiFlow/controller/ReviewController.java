package com.example.TestiFlow.controller;

import com.example.TestiFlow.dto.ReviewDto; // Import DTO
import com.example.TestiFlow.dto.ReviewRequest;
import com.example.TestiFlow.model.Space; // Keep for submitReview
import com.example.TestiFlow.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // PUBLIC ENDPOINT for review submission
    @PostMapping("/{slug}")
    public ResponseEntity<Void> submitReview(@PathVariable String slug, @Valid @RequestBody ReviewRequest reviewRequest) {
        // Service returns Space for redirect URL
        Space space = reviewService.submitReview(slug, reviewRequest);
        // For API calls, return 201 Created instead of redirect to avoid CORS issues
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // UPDATE: ResponseEntity<List<Review>> to ResponseEntity<List<ReviewDto>>
    @GetMapping("/{spaceId}")
    public ResponseEntity<List<ReviewDto>> getReviewsForSpace(@PathVariable String spaceId) {
        String email = getAuthenticatedUserEmail();
        // Service now returns List<ReviewDto>
        List<ReviewDto> reviews = reviewService.getReviewsForSpace(spaceId, email);
        return ResponseEntity.ok(reviews);
        // Removed try-catch as exceptions should be handled globally or by service
    }

    // UPDATE: ResponseEntity<Review> to ResponseEntity<ReviewDto>
    @PutMapping("/{id}/like")
    public ResponseEntity<ReviewDto> likeReview(@PathVariable String id) {
        String email = getAuthenticatedUserEmail();
        // Service now returns ReviewDto
        ReviewDto reviewDto = reviewService.toggleLike(id, email);
        return ResponseEntity.ok(reviewDto);
        // Removed try-catch as exceptions should be handled globally or by service
    }

    // DELETE endpoint remains the same
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReview(@PathVariable String id) {
        String email = getAuthenticatedUserEmail();
        reviewService.deleteReview(id, email); // Let exceptions propagate
        return ResponseEntity.noContent().build();
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
         if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            // Consider throwing a specific AuthenticationException here
            throw new RuntimeException("User not authenticated");
        }
        return ((UserDetails) authentication.getPrincipal()).getUsername();
    }
}