package com.repairflow.dto;

import com.repairflow.entity.RepairStatus;
import jakarta.validation.constraints.NotNull;

public class UpdateRepairStatusRequest {

    @NotNull(message = "Status is required")
    private RepairStatus status;

    public RepairStatus getStatus() {
        return status;
    }

    public void setStatus(RepairStatus status) {
        this.status = status;
    }
}