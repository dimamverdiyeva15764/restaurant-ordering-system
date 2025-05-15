package com.restaurant.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidWaiterException.class)
    public ResponseEntity<?> handleInvalidWaiterException(InvalidWaiterException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
            ex.getMessage(),
            "INVALID_WAITER"
        );
        return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(errorResponse);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<?> handleRuntimeException(RuntimeException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
            ex.getMessage(),
            "BAD_REQUEST"
        );
        return ResponseEntity.badRequest().body(errorResponse);
    }
}

class ErrorResponse {
    private String message;
    private String error;
    private long timestamp;

    public ErrorResponse(String message, String error) {
        this.message = message;
        this.error = error;
        this.timestamp = System.currentTimeMillis();
    }

    // Getters
    public String getMessage() { return message; }
    public String getError() { return error; }
    public long getTimestamp() { return timestamp; }
} 