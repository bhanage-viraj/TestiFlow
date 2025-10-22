package com.example.TestiFlow.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "reviews")
@Data
@NoArgsConstructor
public class Review {
    @Id
    private String id;

    @DBRef
    private Space space;

    private String authorName;
    private String authorEmail; // Optional
    
    private int rating; // e.g., 1-5
    
    private String text;
    
    private boolean liked = false; // Default to not liked
    
    @CreatedDate
    private Instant createdAt;

    public Review(Space space, String authorName, String authorEmail, int rating, String text) {
        this.space = space;
        this.authorName = authorName;
        this.authorEmail = authorEmail;
        this.rating = rating;
        this.text = text;
        this.createdAt = Instant.now();
    }
}