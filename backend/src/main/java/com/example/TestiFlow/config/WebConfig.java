package com.example.TestiFlow.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // Apply CORS rules to all endpoints under /api/
            // Allow requests specifically from these origins
            .allowedOrigins(
                    "http://localhost:3000",
                    "http://localhost:5172",
                    "http://localhost:5173",
                    "http://localhost:5174",
                    "http://localhost:5175",
                    "http://localhost:5176",
                    "http://localhost:5177",
                    "http://localhost:5178",
                    "http://localhost:5179"
            )
            // Allow common HTTP methods
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            // Allow all headers
            .allowedHeaders("*")
            // Allow credentials (like cookies or authorization headers)
            .allowCredentials(true);
    }
}

