package com.repairflow.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

import java.math.BigDecimal;

public class CompleteRepairRequest {

    @NotBlank(message = "Actual action is required")
    private String actualAction;

    @NotNull(message = "Final cost is required")
    @PositiveOrZero(message = "Final cost cannot be negative")
    private BigDecimal finalCost;

    public String getActualAction() {
        return actualAction;
    }

    public void setActualAction(String actualAction) {
        this.actualAction = actualAction;
    }

    public BigDecimal getFinalCost() {
        return finalCost;
    }

    public void setFinalCost(BigDecimal finalCost) {
        this.finalCost = finalCost;
    }
}