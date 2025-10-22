package com.example.TestiFlow.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Data
public class SignUpRequest {
    @NotBlank
    @Size(min = 3, max = 50)
    private String name;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 6, max = 40)
    private String password;
}