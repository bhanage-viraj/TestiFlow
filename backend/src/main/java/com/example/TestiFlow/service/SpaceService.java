package com.example.TestiFlow.service;

import com.example.TestiFlow.dto.SpaceDto;
import com.example.TestiFlow.dto.SpaceRequest;
import com.example.TestiFlow.exception.ResourceNotFoundException;
import com.example.TestiFlow.model.Space;
import com.example.TestiFlow.model.User;
import com.example.TestiFlow.repository.SpaceRepository;
import com.example.TestiFlow.repository.UserRepository;
import com.github.slugify.Slugify;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class SpaceService {

    @Autowired
    private SpaceRepository spaceRepository;

    @Autowired
    private UserRepository userRepository;

    // Add this to pom.xml: <dependency><groupId>com.github.slugify</groupId><artifactId>slugify</artifactId><version>3.0.5</version></dependency>
    private final Slugify slg = Slugify.builder().build();

    /**
     * Helper method to convert a Space model to a SpaceDto.
     * This is the key to preventing the recursive JSON error.
     */
    private SpaceDto convertToDto(Space space) {
        SpaceDto dto = new SpaceDto();
        dto.setId(space.getId());
        dto.setName(space.getName());
        dto.setSlug(space.getSlug());
        dto.setPublicUrl(space.getPublicUrl());
        dto.setRedirectUrl(space.getRedirectUrl());
        dto.setUserId(space.getUser().getId());
        return dto;
    }

    // UPDATE: Changed return type from Space to SpaceDto
    public SpaceDto createSpace(SpaceRequest spaceRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Space space = new Space();
        space.setName(spaceRequest.getName());
        space.setRedirectUrl(spaceRequest.getRedirectUrl());
        space.setUser(user);

        // Generate unique slug
        String slug = slg.slugify(spaceRequest.getName());
        int counter = 1;
        while (spaceRepository.findBySlug(slug).isPresent()) {
            slug = slg.slugify(spaceRequest.getName()) + "-" + counter;
            counter++;
        }
        space.setSlug(slug);
        space.setPublicUrl("/t/" + slug); // Assuming '/t/' is the public path

        Space savedSpace = spaceRepository.save(space);

        // Add this space to the user's list
        user.getSpaces().add(savedSpace);
        userRepository.save(user);

        // Convert to DTO before returning
        return convertToDto(savedSpace);
    }

    // UPDATE: Changed return type from List<Space> to List<SpaceDto>
    public List<SpaceDto> getSpacesForUser(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        
        return spaceRepository.findByUserId(user.getId())
                .stream() // Convert the list
                .map(this::convertToDto) // using our new helper method
                .collect(Collectors.toList()); // into a List<SpaceDto>
    }

    // UPDATE: Changed return type from Optional<Space> to Optional<SpaceDto>
    public Optional<SpaceDto> getSpaceByIdAndUser(String spaceId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        return spaceRepository.findByIdAndUserId(spaceId, user.getId())
                .map(this::convertToDto); // Convert the Optional<Space> to Optional<SpaceDto>
    }

    // UPDATE: Changed return type from Space to SpaceDto
    public SpaceDto updateSpace(String spaceId, SpaceRequest spaceRequest, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));
        
        // Find the original Space model
        Space space = spaceRepository.findByIdAndUserId(spaceId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Space not found with id: " + spaceId));
        
        space.setName(spaceRequest.getName());
        space.setRedirectUrl(spaceRequest.getRedirectUrl());
        
        Space updatedSpace = spaceRepository.save(space);
        
        // Convert to DTO before returning
        return convertToDto(updatedSpace);
    }

    public void deleteSpace(String spaceId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + userEmail));

        Space space = spaceRepository.findByIdAndUserId(spaceId, user.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Space not found with id: " + spaceId));
        
        // TODO: Also delete all reviews associated with this space (Cascade delete)
        // reviewRepository.deleteAll(reviewRepository.findBySpaceId(spaceId));
        
        // Remove space from user's list
        user.getSpaces().remove(space);
        userRepository.save(user);
        
        // Delete the space
        spaceRepository.delete(space);
    }
}