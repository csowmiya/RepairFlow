package com.repairflow.controller;

import com.repairflow.entity.Role;
import com.repairflow.exception.RepairAccessDeniedException;
import com.repairflow.dto.CreateRepairRequest;
import com.repairflow.dto.RepairResponse;
import com.repairflow.dto.UpdateRepairStatusRequest;
import com.repairflow.service.RepairService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.repairflow.dto.AssignTechnicianRequest;
import java.util.List;

@RestController
public class RepairController {

    private final RepairService repairService;

    public RepairController(RepairService repairService) {
        this.repairService = repairService;
    }

    @PostMapping("/repairs")
public ResponseEntity<RepairResponse> createRepair(
        @RequestBody @Valid CreateRepairRequest request,
        Authentication authentication) {

    String email = authentication.getName();

    Role role = Role.valueOf(
            authentication.getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority()
                    .replace("ROLE_", "")
    );

    if (role != Role.CUSTOMER) {
        throw new RepairAccessDeniedException(
                "Only customers can create repair requests"
        );
    }

    RepairResponse createdRepair =
            repairService.createRepair(request, email);

    return ResponseEntity
            .status(201)
            .body(createdRepair);
}

    @GetMapping("/repairs")
public List<RepairResponse> getRepairs(
        Authentication authentication) {

    String email = authentication.getName();

    Role role = Role.valueOf(
        authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "")
);

return repairService.getRepairs(email, role);
}

    @GetMapping("/repairs/{id}")
public RepairResponse getRepairById(
        @PathVariable Long id,
        Authentication authentication) {

    String email = authentication.getName();

    Role role = Role.valueOf(
        authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "")
);

return repairService.getRepairById(id, email, role);
}

    @PutMapping("/repairs/{id}/status")
public RepairResponse updateRepairStatus(
        @PathVariable Long id,
        @RequestBody @Valid UpdateRepairStatusRequest request,
        Authentication authentication) {

    String email = authentication.getName();

    Role role = Role.valueOf(
        authentication.getAuthorities()
                .iterator()
                .next()
                .getAuthority()
                .replace("ROLE_", "")
);

    return repairService.updateRepairStatus(
            id,
            request,
            email,
            role
    );
}

    @DeleteMapping("/repairs/{id}")
public ResponseEntity<Void> deleteRepair(
        @PathVariable Long id,
        Authentication authentication) {

    String email = authentication.getName();

    Role role = Role.valueOf(
            authentication.getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority()
                    .replace("ROLE_", "")
    );

    repairService.deleteRepair(id, email, role);

    return ResponseEntity.noContent().build();
}
    @PutMapping("/repairs/{id}/assign")
    public RepairResponse assignTechnician(
        @PathVariable Long id,
        @RequestBody @Valid AssignTechnicianRequest request,
        Authentication authentication) {

    Role role = Role.valueOf(
            authentication.getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority()
                    .replace("ROLE_", "")
    );

    if (role != Role.ADMIN) {
        throw new RepairAccessDeniedException(
                "Only admins can assign technicians");
    }

   return repairService.assignTechnician(
        id,
        request.getTechnicianId(),
        authentication.getName()
);
}
@GetMapping("/repairs/{id}/history")
public List<?> getRepairHistory(
        @PathVariable Long id,
        Authentication authentication) {

    String email = authentication.getName();

    Role role = Role.valueOf(
            authentication.getAuthorities()
                    .iterator()
                    .next()
                    .getAuthority()
                    .replace("ROLE_", "")
    );

    return repairService.getRepairHistory(
            id,
            email,
            role
    );
}
}