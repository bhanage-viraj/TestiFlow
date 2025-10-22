package com.example.TestiFlow.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class SpaceRequest {
    @NotBlank
    private String name;

    @NotBlank
    private String redirectUrl; // e.g., "https://my-product.com"
}