package com.repairflow.dto;

import com.repairflow.entity.Role;
import com.repairflow.entity.User;

public class UserResponse {

    private Long id;
    private String name;
    private String email;
    private Role role;

    public UserResponse(
            Long id,
            String name,
            String email,
            Role role) {

        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public static UserResponse fromUser(User user) {

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole()
        );
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public Role getRole() {
        return role;
    }
}