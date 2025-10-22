package com.example.TestiFlow.model;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.ArrayList;
import java.util.List;

@Document(collection = "users")
@Data
@NoArgsConstructor
public class User {
    @Id
    private String id;
    
    private String name;
    
    @Indexed(unique = true)
    private String email;
    
    private String password;

    @DBRef(lazy = true) // Use lazy loading to avoid fetching all spaces every time
    private List<Object> spaces = new ArrayList<>();

    public User(String name, String email, String password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
