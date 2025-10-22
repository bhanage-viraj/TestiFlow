package com.example.TestiFlow.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;

@Document(collection = "spaces")
@Data
@NoArgsConstructor
public class Space {
    @Id
    private String id;

    @DBRef
    private User user; // The owner

    @NotBlank
    private String name;

    @Indexed(unique = true)
    private String slug; // Auto-generated, e.g., "my-product"

    private String publicUrl; // Auto-generated, e.g., "/t/my-product"

    @NotBlank
    private String redirectUrl; // URL to redirect to after review submission

    // We can add more fields here later as needed
    // private String themeColor;
    // private String logoUrl;
}