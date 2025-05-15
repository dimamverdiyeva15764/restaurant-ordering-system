package com.restaurant.exception;

public class InvalidWaiterException extends RuntimeException {
    public InvalidWaiterException(String message) {
        super(message);
    }
} 