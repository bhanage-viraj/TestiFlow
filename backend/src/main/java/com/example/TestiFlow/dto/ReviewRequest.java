package com.example.TestiFlow.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class ReviewRequest {
    @NotBlank
    private String authorName;
    
    private String authorEmail; // Can be optional
    
    @Min(1)
    @Max(5)
    private int rating;
    
    @NotBlank
    private String text;
}