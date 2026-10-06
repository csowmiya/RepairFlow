package com.repairflow.dto;

import com.repairflow.entity.RepairStatus;
import com.repairflow.entity.Role;
import java.time.LocalDateTime;

public class RepairHistoryResponse {

    private Long id;
    private String changedBy;
    private Role changedByRole;
    private String description;
    private RepairStatus oldStatus;
    private RepairStatus newStatus;
    private LocalDateTime changedAt;

    public RepairHistoryResponse(
            Long id,
            String changedBy,
            Role changedByRole,
            String description,
            RepairStatus oldStatus,
            RepairStatus newStatus,
            LocalDateTime changedAt) {

        this.id = id;
        this.changedBy = changedBy;
        this.changedByRole = changedByRole;
        this.description = description;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedAt = changedAt;
    }

    public Long getId() {
        return id;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public Role getChangedByRole() {
        return changedByRole;
    }

    public String getDescription() {
        return description;
    }

    public RepairStatus getOldStatus() {
        return oldStatus;
    }

    public RepairStatus getNewStatus() {
        return newStatus;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }
}