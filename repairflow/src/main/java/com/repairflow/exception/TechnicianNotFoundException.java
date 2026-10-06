package com.repairflow.exception;

public class TechnicianNotFoundException extends RuntimeException {

    public TechnicianNotFoundException(String message) {
        super(message);
    }
}