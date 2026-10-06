package com.repairflow.controller;

import com.repairflow.dto.CompleteRepairRequest;
import com.repairflow.dto.DiagnosisApprovalRequest;
import com.repairflow.dto.DiagnosisRequest;
import com.repairflow.dto.DiagnosisResponse;
import com.repairflow.entity.Role;
import com.repairflow.service.DiagnosisService;

import jakarta.validation.Valid;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/repairs")
public class DiagnosisController {

    private final DiagnosisService diagnosisService;

    public DiagnosisController(
            DiagnosisService diagnosisService) {

        this.diagnosisService = diagnosisService;
    }

    /*
     * ============================================================
     * CREATE DIAGNOSIS
     * ============================================================
     */

    @PostMapping("/{repairId}/diagnosis")
    public DiagnosisResponse createDiagnosis(
            @PathVariable Long repairId,
            @RequestBody @Valid DiagnosisRequest request,
            Authentication authentication) {

        return diagnosisService.createDiagnosis(
                repairId,
                request,
                authentication.getName()
        );
    }

    /*
     * ============================================================
     * GET DIAGNOSIS
     * ============================================================
     */

    @GetMapping("/{repairId}/diagnosis")
    public DiagnosisResponse getDiagnosis(
            @PathVariable Long repairId,
            Authentication authentication) {

        Role role = Role.valueOf(
                authentication.getAuthorities()
                        .iterator()
                        .next()
                        .getAuthority()
                        .replace("ROLE_", "")
        );

        return diagnosisService.getDiagnosis(
                repairId,
                authentication.getName(),
                role
        );
    }

    /*
     * ============================================================
     * CUSTOMER APPROVAL
     * ============================================================
     */

    @PutMapping("/{repairId}/diagnosis/approval")
    public DiagnosisResponse approveDiagnosis(
            @PathVariable Long repairId,
            @RequestBody @Valid DiagnosisApprovalRequest request,
            Authentication authentication) {

        return diagnosisService.approveDiagnosis(
                repairId,
                request,
                authentication.getName()
        );
    }

    /*
     * ============================================================
     * COMPLETE REPAIR
     * ============================================================
     */

    @PutMapping("/{repairId}/complete")
    public DiagnosisResponse completeRepair(
            @PathVariable Long repairId,
            @RequestBody @Valid CompleteRepairRequest request,
            Authentication authentication) {

        return diagnosisService.completeRepair(
                repairId,
                request,
                authentication.getName()
        );
    }
}