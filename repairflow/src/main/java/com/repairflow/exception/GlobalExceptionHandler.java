package com.repairflow.exception;

import com.repairflow.response.ErrorResponse;

import java.util.HashMap;
import java.util.Map;


import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.bind.MethodArgumentNotValidException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RepairNotFoundException.class)
    @ResponseStatus(HttpStatus.NOT_FOUND)
    public ErrorResponse handleRepairNotFound(RepairNotFoundException exception) {
        return new ErrorResponse(
                404,
                exception.getMessage()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public ErrorResponse handleValidationException(
        MethodArgumentNotValidException exception) {

        Map<String, String> errors = new HashMap<>();

    exception.getBindingResult()
            .getFieldErrors()
            .forEach(error ->
                    errors.put(
                            error.getField(),
                            error.getDefaultMessage()
                    )
            );

    return new ErrorResponse(
            400,
            "Validation failed",
            errors
    );
}

@ExceptionHandler(RepairAccessDeniedException.class)
@ResponseStatus(HttpStatus.FORBIDDEN)
public ErrorResponse handleRepairAccessDenied(
        RepairAccessDeniedException exception) {

    return new ErrorResponse(
            403,
            exception.getMessage()
    );
}

@ExceptionHandler(InvalidStatusTransitionException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public ErrorResponse handleInvalidStatusTransition(
        InvalidStatusTransitionException exception) {

    return new ErrorResponse(
            400,
            exception.getMessage()
    );
}

@ExceptionHandler(UserAlreadyExistsException.class)
@ResponseStatus(HttpStatus.CONFLICT)
public ErrorResponse handleUserAlreadyExists(
        UserAlreadyExistsException exception) {

    return new ErrorResponse(
            409,
            exception.getMessage()
    );
}

@ExceptionHandler(TechnicianNotFoundException.class)
@ResponseStatus(HttpStatus.NOT_FOUND)
public ErrorResponse handleTechnicianNotFound(
        TechnicianNotFoundException exception) {

    return new ErrorResponse(
            404,
            exception.getMessage()
    );
}

@ExceptionHandler(InvalidTechnicianException.class)
@ResponseStatus(HttpStatus.BAD_REQUEST)
public ErrorResponse handleInvalidTechnician(
        InvalidTechnicianException exception) {

    return new ErrorResponse(
            400,
            exception.getMessage()
    );
}

@ExceptionHandler(InvalidCredentialsException.class)
@ResponseStatus(HttpStatus.UNAUTHORIZED)
public ErrorResponse handleInvalidCredentials(
        InvalidCredentialsException exception) {

    return new ErrorResponse(
            401,
            exception.getMessage()
    );
}

@ExceptionHandler(DiagnosisAlreadyExistsException.class)
@ResponseStatus(HttpStatus.CONFLICT)
public ErrorResponse handleDiagnosisAlreadyExists(
        DiagnosisAlreadyExistsException exception) {

    return new ErrorResponse(
            409,
            exception.getMessage()
    );
}
}