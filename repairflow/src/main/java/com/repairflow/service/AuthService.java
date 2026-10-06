package com.repairflow.service;


import com.repairflow.dto.AuthResponse;
import com.repairflow.dto.LoginRequest;
import com.repairflow.dto.RegisterRequest;
import com.repairflow.dto.UserResponse;
import com.repairflow.entity.Role;
import com.repairflow.entity.User;
import com.repairflow.exception.InvalidCredentialsException;
import com.repairflow.exception.UserAlreadyExistsException;
import com.repairflow.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
private final PasswordEncoder passwordEncoder;
private final JwtService jwtService;

    public AuthService(
        UserRepository userRepository,
        PasswordEncoder passwordEncoder,
        JwtService jwtService) {

    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.jwtService = jwtService;
}

    public User register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
    throw new UserAlreadyExistsException("Email already registered");
}

        User user = new User();

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        String hashedPassword =
                passwordEncoder.encode(request.getPassword());

        user.setPassword(hashedPassword);

        user.setRole(Role.CUSTOMER);

        return userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {

    User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() ->
                    new InvalidCredentialsException("Invalid email or password"));

    boolean passwordMatches =
            passwordEncoder.matches(
                    request.getPassword(),
                    user.getPassword()
            );

    if (!passwordMatches) {
        throw new InvalidCredentialsException("Invalid email or password");
    }

    String token = jwtService.generateToken(user);

    UserResponse userResponse =
            UserResponse.fromUser(user);

    return new AuthResponse(
            token,
            userResponse
    );
}
}