package com.example.library.backend.exception;

public class RoleNotFoundWithNameException extends RuntimeException {
    public RoleNotFoundWithNameException(String exceptionText) {
        super(exceptionText);
    }
}
