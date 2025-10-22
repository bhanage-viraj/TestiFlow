package com.example.TestiFlow.repository;

import com.example.TestiFlow.model.Review;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReviewRepository extends MongoRepository<Review, String> {
    List<Review> findBySpaceId(String spaceId);
    List<Review> findBySpaceIdAndLikedTrue(String spaceId);
}