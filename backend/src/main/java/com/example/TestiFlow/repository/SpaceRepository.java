package com.example.TestiFlow.repository;

import com.example.TestiFlow.model.Space;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SpaceRepository extends MongoRepository<Space, String> {
    List<Space> findByUserId(String userId);
    Optional<Space> findBySlug(String slug);
    Optional<Space> findByIdAndUserId(String id, String userId);
}