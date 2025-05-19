package com.restaurant.service;

import com.restaurant.model.User;
import com.restaurant.model.User.UserRole;
import com.restaurant.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class LoginServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private LoginService loginService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    // Test: Successful authentication
    @Test
    void testAuthenticateUser_Success() {
        String username = "john";
        String rawPassword = "pass123";
        String encodedPassword = "hashedPass";

        User mockUser = new User(username, encodedPassword, UserRole.WAITER);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(mockUser));
        when(passwordEncoder.matches(rawPassword, encodedPassword)).thenReturn(true);

        User authenticated = loginService.authenticateUser(username, rawPassword);

        assertEquals(username, authenticated.getUsername());
        verify(passwordEncoder).matches(rawPassword, encodedPassword);
    }

    // Test: User not found
    @Test
    void testAuthenticateUser_UserNotFound() {
        when(userRepository.findByUsername("nonexistent")).thenReturn(Optional.empty());

        assertThrows(BadCredentialsException.class, () ->
                loginService.authenticateUser("nonexistent", "anyPass"));
    }

    // Test: Invalid password
    @Test
    void testAuthenticateUser_InvalidPassword() {
        String username = "john";
        User user = new User(username, "hashedPass", UserRole.WAITER);

        when(userRepository.findByUsername(username)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrongPass", "hashedPass")).thenReturn(false);

        assertThrows(BadCredentialsException.class, () ->
                loginService.authenticateUser(username, "wrongPass"));
    }

    // Test: Successful registration
    @Test
    void testRegisterUser_Success() {
        String username = "newuser";
        String rawPassword = "newpass";
        String encodedPassword = "encoded";

        when(userRepository.findByUsername(username)).thenReturn(null);
        when(passwordEncoder.encode(rawPassword)).thenReturn(encodedPassword);
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        User registered = loginService.registerUser(username, rawPassword, UserRole.WAITER);

        assertEquals(username, registered.getUsername());
        assertEquals(encodedPassword, registered.getPassword());
        assertEquals(UserRole.WAITER, registered.getRole());
    }

    // Test: Username already exists
    @Test
    void testRegisterUser_UsernameExists() {
        when(userRepository.findByUsername("existing")).thenReturn(Optional.of(new User()));

        assertThrows(RuntimeException.class, () ->
                loginService.registerUser("existing", "password", UserRole.WAITER));
    }
}
