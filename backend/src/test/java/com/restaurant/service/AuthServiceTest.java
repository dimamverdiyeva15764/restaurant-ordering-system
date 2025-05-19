package com.restaurant.service;

import com.restaurant.model.User;
import com.restaurant.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.data.domain.Example;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @InjectMocks
    private AuthService authService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Test: Successful authentication
    @Test
    void testAuthenticate_Success() {
        String username = "john";
        String rawPassword = "password123";
        String encodedPassword = "encodedPass";

        User mockUser = new User();
        mockUser.setUsername(username);
        mockUser.setPassword(encodedPassword);

        when(userRepository.findAll(any(Example.class))).thenReturn(List.of(mockUser));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);

        User authenticated = authService.authenticate(username, rawPassword);

        assertEquals(username, authenticated.getUsername());
        verify(passwordEncoder).matches(rawPassword, encodedPassword);
    }

    // Test: User not found
    @Test
    void testAuthenticate_UserNotFound() {
        when(userRepository.findAll(any(Example.class))).thenReturn(Collections.emptyList());

        assertThrows(BadCredentialsException.class, () ->
                authService.authenticate("nonexistent", "pass"));
    }

    // Test: Wrong password
    @Test
    void testAuthenticate_InvalidPassword() {
        User user = new User();
        user.setUsername("john");
        user.setPassword("hashed");

        when(userRepository.findAll(any(Example.class))).thenReturn(List.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(BadCredentialsException.class, () ->
                authService.authenticate("john", "wrongpass"));
    }

    // Test: Successful registration
    @Test
    void testRegister_Success() {
        User newUser = new User();
        newUser.setUsername("alice");
        newUser.setPassword("plaintext");

        when(userRepository.existsByUsername("alice")).thenReturn(false);
        when(passwordEncoder.encode("plaintext")).thenReturn("hashedPass");
        when(userRepository.save(any(User.class))).thenAnswer(i -> i.getArgument(0));

        User registered = authService.register(newUser);

        assertEquals("alice", registered.getUsername());
        assertEquals("hashedPass", registered.getPassword());
        verify(userRepository).save(any(User.class));
    }

    // Test: Username already exists
    @Test
    void testRegister_UsernameExists() {
        User user = new User();
        user.setUsername("existing");

        when(userRepository.existsByUsername("existing")).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(user));
    }
}
