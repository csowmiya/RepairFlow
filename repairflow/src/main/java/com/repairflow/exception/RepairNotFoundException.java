package com.repairflow.exception;

public class RepairNotFoundException extends RuntimeException {

    public RepairNotFoundException(String message) {
        super(message);
    }
}