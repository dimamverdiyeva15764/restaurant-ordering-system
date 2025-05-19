package com.restaurant.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.restaurant.model.User;
import com.restaurant.model.User.UserRole;
import com.restaurant.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll(); // Clean DB before each test
    }

    @Test
    void testRegisterUser_success() throws Exception {
        User user = new User();
        user.setUsername("testuser");
        user.setPassword("password");
        user.setRole(UserRole.MANAGER);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(user)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("testuser"));
    }

    @Test
    void testRegisterUser_usernameAlreadyExists() throws Exception {
        User existingUser = new User();
        existingUser.setUsername("duplicate");
        existingUser.setPassword(passwordEncoder.encode("pass"));
        existingUser.setRole(UserRole.WAITER);
        userRepository.save(existingUser);

        User newUser = new User();
        newUser.setUsername("duplicate");
        newUser.setPassword("pass");
        newUser.setRole(UserRole.WAITER);

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(newUser)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string("Username already exists"));
    }

    @Test
    void testLogin_success() throws Exception {
        User user = new User();
        user.setUsername("loginuser");
        user.setPassword(passwordEncoder.encode("securepass"));
        user.setRole(UserRole.MANAGER);
        userRepository.save(user);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setUsername("loginuser");
        loginRequest.setPassword("securepass");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("loginuser"));
    }

    // Inner class to match controller's LoginRequest
    static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }

        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
