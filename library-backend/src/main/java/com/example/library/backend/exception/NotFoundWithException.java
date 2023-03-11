package com.example.library.backend.exception;

public class NotFoundWithException extends RuntimeException {
    public NotFoundWithException(String exceptionText) {
        super(exceptionText);
    }
}
