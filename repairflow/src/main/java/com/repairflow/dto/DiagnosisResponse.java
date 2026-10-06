package com.repairflow.dto;

import com.repairflow.entity.ApprovalStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class DiagnosisResponse {

    private Long id;
    private Long repairId;
    private String technicianName;
    private String technicianEmail;
    private String diagnosis;
    private String recommendedAction;
    private String actualAction;
    private BigDecimal estimatedCost;
    private BigDecimal finalCost;
    private ApprovalStatus approvalStatus;
    private LocalDateTime diagnosedAt;


    public DiagnosisResponse(
            Long id,
            Long repairId,
            String technicianName,
            String technicianEmail,
            String diagnosis,
            String recommendedAction,
            String actualAction,
            BigDecimal estimatedCost,
            BigDecimal finalCost,
            ApprovalStatus approvalStatus,
            LocalDateTime diagnosedAt) {

        this.id = id;
        this.repairId = repairId;
        this.technicianName = technicianName;
        this.technicianEmail = technicianEmail;
        this.diagnosis = diagnosis;
        this.recommendedAction = recommendedAction;
        this.actualAction = actualAction;
        this.estimatedCost = estimatedCost;
        this.finalCost = finalCost;
        this.approvalStatus = approvalStatus;
        this.diagnosedAt = diagnosedAt;
    }


    public Long getId() {
        return id;
    }

    public Long getRepairId() {
        return repairId;
    }

    public String getTechnicianName() {
        return technicianName;
    }

    public String getTechnicianEmail() {
        return technicianEmail;
    }

    public String getDiagnosis() {
        return diagnosis;
    }

    public String getRecommendedAction() {
        return recommendedAction;
    }

    public String getActualAction() {
        return actualAction;
    }

    public BigDecimal getEstimatedCost() {
        return estimatedCost;
    }

    public BigDecimal getFinalCost() {
        return finalCost;
    }

    public ApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public LocalDateTime getDiagnosedAt() {
        return diagnosedAt;
    }
}