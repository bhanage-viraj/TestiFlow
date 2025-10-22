package com.example.TestiFlow.dto;

import lombok.Data;


@Data
public class UserDto {
    private String id;
    private String name;
    private String email;
    // We might not want to send the full list of spaces, but it's an option
    // private List<String> spaceIds; 
}