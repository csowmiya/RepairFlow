package com.repairflow.dto;

import com.repairflow.entity.RepairStatus;

import java.time.LocalDateTime;

public class CustomerRepairHistoryResponse {

    private Long id;
    private String description;
    private RepairStatus oldStatus;
    private RepairStatus newStatus;
    private LocalDateTime changedAt;

    public CustomerRepairHistoryResponse(
            Long id,
            String description,
            RepairStatus oldStatus,
            RepairStatus newStatus,
            LocalDateTime changedAt) {

        this.id = id;
        this.description = description;
        this.oldStatus = oldStatus;
        this.newStatus = newStatus;
        this.changedAt = changedAt;
    }

    public Long getId() {
        return id;
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