package com.repairflow.service;

import com.repairflow.dto.CreateTechnicianRequest;
import com.repairflow.entity.Role;
import com.repairflow.entity.User;
import com.repairflow.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.repairflow.dto.TechnicianResponse;
import java.util.List;
import com.repairflow.exception.UserAlreadyExistsException;
import com.repairflow.dto.CreateAdminRequest;
@Service
public class AdminService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public void createTechnician(
            CreateTechnicianRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
           throw new UserAlreadyExistsException(
        "User with this email already exists");
        }

        User technician = new User();

        technician.setName(request.getName());
        technician.setEmail(request.getEmail());

        technician.setPassword(
                passwordEncoder.encode(
                        request.getPassword()
                )
        );

        technician.setRole(Role.TECHNICIAN);

        userRepository.save(technician);
    }

    public List<TechnicianResponse> getTechnicians() {

    return userRepository.findByRole(Role.TECHNICIAN)
        .stream()
        .map(user ->
                new TechnicianResponse(
                        user.getId(),
                        user.getName(),
                        user.getEmail()
                )
        )
        .toList();
}

public void createAdmin(
        CreateAdminRequest request) {

    if (userRepository.existsByEmail(request.getEmail())) {

        throw new UserAlreadyExistsException(
                "User with this email already exists"
        );
    }

    User admin = new User();

    admin.setName(request.getName());

    admin.setEmail(request.getEmail());

    admin.setPassword(
            passwordEncoder.encode(
                    request.getPassword()
            )
    );

    // IMPORTANT:
    // The backend decides the role.
    // The frontend cannot choose it.
    admin.setRole(Role.ADMIN);

    userRepository.save(admin);
}


}