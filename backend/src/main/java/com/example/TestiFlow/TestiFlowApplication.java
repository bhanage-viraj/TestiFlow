package com.example.TestiFlow;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.mongodb.config.EnableMongoAuditing; // Import this

@SpringBootApplication
@EnableMongoAuditing // Add this annotation
public class TestiFlowApplication {

    public static void main(String[] args) {
        SpringApplication.run(TestiFlowApplication.class, args);
    }

}