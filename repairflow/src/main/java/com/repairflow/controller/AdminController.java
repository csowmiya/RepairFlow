package com.repairflow.controller;

import com.repairflow.dto.CreateTechnicianRequest;
import com.repairflow.dto.TechnicianResponse;
import com.repairflow.service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.repairflow.dto.CreateAdminRequest;
import java.util.List;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PostMapping("/technicians")
    @ResponseStatus(HttpStatus.CREATED)
    public String createTechnician(
            @RequestBody @Valid CreateTechnicianRequest request) {

        adminService.createTechnician(request);

        return "Technician created successfully";
    }

    @GetMapping("/technicians")
    public List<TechnicianResponse> getTechnicians() {

        return adminService.getTechnicians();
    }

@PostMapping("/admins")
@ResponseStatus(HttpStatus.CREATED)
public String createAdmin(
        @RequestBody @Valid CreateAdminRequest request) {

    adminService.createAdmin(request);

    return "Admin created successfully";
}

}
