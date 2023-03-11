package com.example.library.backend.service;

public interface EmailSenderService {
    void sendEmail(String toEmail, String content);
}
