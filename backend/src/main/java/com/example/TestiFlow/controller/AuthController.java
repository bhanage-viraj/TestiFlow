package com.example.TestiFlow.controller;

import com.example.TestiFlow.dto.JwtAuthResponse;
import com.example.TestiFlow.dto.LoginRequest;
import com.example.TestiFlow.dto.SignUpRequest;
import com.example.TestiFlow.dto.UserDto;
import com.example.TestiFlow.model.User;
import com.example.TestiFlow.repository.UserRepository;
import com.example.TestiFlow.security.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtil.generateToken(loginRequest.getEmail());
        return ResponseEntity.ok(new JwtAuthResponse(jwt));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@Valid @RequestBody SignUpRequest signUpRequest) {
        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return new ResponseEntity<>("Email is already taken!", HttpStatus.BAD_REQUEST);
        }

        // Create new user's account
        User user = new User(
            signUpRequest.getName(),
            signUpRequest.getEmail(),
            passwordEncoder.encode(signUpRequest.getPassword())
        );

        userRepository.save(user);
        return new ResponseEntity<>("User registered successfully", HttpStatus.CREATED);
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() || authentication.getPrincipal().equals("anonymousUser")) {
            return new ResponseEntity<>("No user authenticated", HttpStatus.UNAUTHORIZED);
        }

        String email = ((UserDetails) authentication.getPrincipal()).getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found")); // Should not happen

        // Create a DTO to send back
        UserDto userDto = new UserDto();
        userDto.setId(user.getId());
        userDto.setName(user.getName());
        userDto.setEmail(user.getEmail());

        return ResponseEntity.ok(userDto);
    }
}