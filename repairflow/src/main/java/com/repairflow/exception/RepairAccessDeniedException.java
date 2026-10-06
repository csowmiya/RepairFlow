package com.repairflow.exception;

public class RepairAccessDeniedException extends RuntimeException {

    public RepairAccessDeniedException(String message) {
        super(message);
    }
}