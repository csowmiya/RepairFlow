package com.repairflow.dto;

import com.repairflow.entity.ApprovalStatus;
import jakarta.validation.constraints.NotNull;

public class DiagnosisApprovalRequest {

    @NotNull(message = "Approval status is required")
    private ApprovalStatus approvalStatus;

    public ApprovalStatus getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(ApprovalStatus approvalStatus) {
        this.approvalStatus = approvalStatus;
    }
}