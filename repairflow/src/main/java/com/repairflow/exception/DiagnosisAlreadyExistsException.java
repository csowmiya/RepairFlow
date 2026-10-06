package com.repairflow.exception;

public class DiagnosisAlreadyExistsException extends RuntimeException {

    public DiagnosisAlreadyExistsException(String message) {
        super(message);
    }
}