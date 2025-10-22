package com.example.TestiFlow.service;

import com.example.TestiFlow.dto.ReviewDto; // Import DTO
import com.example.TestiFlow.dto.ReviewRequest;
import com.example.TestiFlow.exception.ResourceNotFoundException;
import com.example.TestiFlow.model.Review;
import com.example.TestiFlow.model.Space;
import com.example.TestiFlow.repository.ReviewRepository;
import com.example.TestiFlow.repository.SpaceRepository;
import com.example.TestiFlow.service.SpaceService; // Keep this
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors; // Import this

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private SpaceRepository spaceRepository;

    @Autowired
    private SpaceService spaceService; // Needed for ownership checks

    /**
     * Helper method to convert Review model to ReviewDto.
     */
    private ReviewDto convertToDto(Review review) {
        ReviewDto dto = new ReviewDto();
        dto.setId(review.getId());
        dto.setSpaceId(review.getSpace().getId()); // Use space ID
        dto.setAuthorName(review.getAuthorName());
        dto.setAuthorEmail(review.getAuthorEmail());
        dto.setRating(review.getRating());
        dto.setText(review.getText());
        dto.setLiked(review.isLiked());
        dto.setCreatedAt(review.getCreatedAt());
        return dto;
    }

    // Public method - submitReview remains largely the same
    public Space submitReview(String slug, ReviewRequest reviewRequest) {
        Space space = spaceRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Space not found with slug: " + slug));

        Review review = new Review(
                space,
                reviewRequest.getAuthorName(),
                reviewRequest.getAuthorEmail(),
                reviewRequest.getRating(),
                reviewRequest.getText()
        );

        reviewRepository.save(review);
        return space; // Still return Space for redirect URL
    }

    // UPDATE: Change return type List<Review> to List<ReviewDto>
    public List<ReviewDto> getReviewsForSpace(String spaceId, String userEmail) {
        // This implicitly checks ownership via SpaceService
        spaceService.getSpaceByIdAndUser(spaceId, userEmail)
                 .orElseThrow(() -> new ResourceNotFoundException("Space not found or user not authorized"));

        return reviewRepository.findBySpaceId(spaceId)
                .stream()
                .map(this::convertToDto) // Convert each Review
                .collect(Collectors.toList());
    }

    // UPDATE: Change return type Review to ReviewDto
    public ReviewDto toggleLike(String reviewId, String userEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        // Check ownership via SpaceService
        spaceService.getSpaceByIdAndUser(review.getSpace().getId(), userEmail)
                 .orElseThrow(() -> new RuntimeException("User not authorized to modify this review")); // Or specific exception

        review.setLiked(!review.isLiked());
        Review updatedReview = reviewRepository.save(review);
        return convertToDto(updatedReview); // Convert before returning
    }

    // Delete method remains the same (returns void)
    public void deleteReview(String reviewId, String userEmail) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review not found with id: " + reviewId));

        // Check ownership via SpaceService
        spaceService.getSpaceByIdAndUser(review.getSpace().getId(), userEmail)
                 .orElseThrow(() -> new RuntimeException("User not authorized to delete this review")); // Or specific exception

        reviewRepository.delete(review);
    }

    // UPDATE: Public method for embeds - return List<ReviewDto>
    public List<ReviewDto> getLikedReviews(String spaceId) {
        if (!spaceRepository.existsById(spaceId)) {
            throw new ResourceNotFoundException("Space not found with id: " + spaceId);
        }
        return reviewRepository.findBySpaceIdAndLikedTrue(spaceId)
                .stream()
                .map(this::convertToDto) // Convert each Review
                .collect(Collectors.toList());
    }
}