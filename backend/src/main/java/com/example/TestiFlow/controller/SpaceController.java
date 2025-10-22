package com.example.TestiFlow.controller;

import com.example.TestiFlow.dto.SpaceDto;
import com.example.TestiFlow.dto.SpaceRequest;

import com.example.TestiFlow.service.SpaceService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/spaces")
public class SpaceController {

    @Autowired
    private SpaceService spaceService;

    // UPDATE: ResponseEntity<Space> to ResponseEntity<SpaceDto>
    @PostMapping
    public ResponseEntity<SpaceDto> createSpace(@Valid @RequestBody SpaceRequest spaceRequest) {
        String email = getAuthenticatedUserEmail();
        SpaceDto spaceDto = spaceService.createSpace(spaceRequest, email);
        return new ResponseEntity<>(spaceDto, HttpStatus.CREATED);
    }

    // UPDATE: ResponseEntity<List<Space>> to ResponseEntity<List<SpaceDto>>
    @GetMapping
    public ResponseEntity<List<SpaceDto>> getAllSpacesForUser() {
        String email = getAuthenticatedUserEmail();
        List<SpaceDto> spaces = spaceService.getSpacesForUser(email);
        return ResponseEntity.ok(spaces);
    }

    // UPDATE: ResponseEntity<Space> to ResponseEntity<SpaceDto>
    @GetMapping("/{id}")
    public ResponseEntity<SpaceDto> getSpaceById(@PathVariable String id) {
        String email = getAuthenticatedUserEmail();
        return spaceService.getSpaceByIdAndUser(id, email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // UPDATE: ResponseEntity<Space> to ResponseEntity<SpaceDto>
    @PutMapping("/{id}")
    public ResponseEntity<SpaceDto> updateSpace(@PathVariable String id, @Valid @RequestBody SpaceRequest spaceRequest) {
        String email = getAuthenticatedUserEmail();
        // The service now handles the ResourceNotFoundException
        SpaceDto updatedSpace = spaceService.updateSpace(id, spaceRequest, email);
        return ResponseEntity.ok(updatedSpace);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpace(@PathVariable String id) {
        String email = getAuthenticatedUserEmail();
        spaceService.deleteSpace(id, email);
        return ResponseEntity.noContent().build();
    }

    private String getAuthenticatedUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("User not authenticated");
        }
        return ((UserDetails) authentication.getPrincipal()).getUsername();
    }
}