package com.example.TestiFlow.dto;

import lombok.Data;
import java.time.Instant;

/**
 * Data Transfer Object for a Review.
 * Used to send clean Review data to the frontend, preventing recursion.
 */
@Data
public class ReviewDto {
    private String id;
    private String spaceId; // Only send the ID
    private String authorName;
    private String authorEmail;
    private int rating;
    private String text;
    private boolean liked;
    private Instant createdAt;
}