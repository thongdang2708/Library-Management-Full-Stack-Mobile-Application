package com.example.library.backend.exception;

public class BadRequestWithException extends RuntimeException {
    public BadRequestWithException(String exceptionText) {
        super(exceptionText);
    }
}
