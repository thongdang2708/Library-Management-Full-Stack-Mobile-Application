package com.example.library.backend.exception;

public class UserExistsException extends RuntimeException {
    public UserExistsException(String exceptionText) {
        super(exceptionText);
    }
}
