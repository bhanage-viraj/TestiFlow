package com.example.TestiFlow.dto;

import lombok.Data;

@Data
public class SpaceDto {
    private String id;
    private String name;
    private String slug;
    private String publicUrl;
    private String redirectUrl;
    private String userId; // Note: We only send the ID, not the whole User object
}