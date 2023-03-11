package com.example.library.backend.exception;

public class SendEmailException extends RuntimeException {
    public SendEmailException(String exceptionText) {
        super(exceptionText);
    }
}
