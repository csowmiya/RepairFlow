package com.repairflow.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.time.LocalDateTime;

@Entity
public class RepairHistory {

    @Id
    @GeneratedValue
    private Long id;

    @ManyToOne
    @JoinColumn(name = "repair_id", nullable = false)
    private Repair repair;

    private String changedBy;

    @Enumerated(EnumType.STRING)
    private Role changedByRole;

    private String description;

    @Enumerated(EnumType.STRING)
    private RepairStatus oldStatus;

    @Enumerated(EnumType.STRING)
    private RepairStatus newStatus;

    private LocalDateTime changedAt;


    public Long getId() {
        return id;
    }

    public Repair getRepair() {
        return repair;
    }

    public void setRepair(Repair repair) {
        this.repair = repair;
    }

    public String getChangedBy() {
        return changedBy;
    }

    public void setChangedBy(String changedBy) {
        this.changedBy = changedBy;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RepairStatus getOldStatus() {
        return oldStatus;
    }

    public void setOldStatus(RepairStatus oldStatus) {
        this.oldStatus = oldStatus;
    }

    public RepairStatus getNewStatus() {
        return newStatus;
    }

    public void setNewStatus(RepairStatus newStatus) {
        this.newStatus = newStatus;
    }

    public LocalDateTime getChangedAt() {
        return changedAt;
    }

    public void setChangedAt(LocalDateTime changedAt) {
        this.changedAt = changedAt;
    }

    public Role getChangedByRole() {
    return changedByRole;
}

    public void setChangedByRole(Role changedByRole) {
    this.changedByRole = changedByRole;
}
}