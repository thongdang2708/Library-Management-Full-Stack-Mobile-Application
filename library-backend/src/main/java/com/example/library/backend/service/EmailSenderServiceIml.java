package com.example.library.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import com.example.library.backend.exception.SendEmailException;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailSenderServiceIml implements EmailSenderService {

    private static final Logger logger = LoggerFactory.getLogger(EmailSenderServiceIml.class);

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String hostEmail;

    @Override
    public void sendEmail(String toEmail, String content) {
        try {

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "utf-8");
            helper.setText(content, true);
            helper.setFrom(hostEmail);
            helper.setTo(toEmail);
            helper.setSubject("Email Verification!");

            mailSender.send(message);

        } catch (MessagingException ex) {
            logger.error("Fail to send email!");
            throw new SendEmailException("Cannot send email!");
        }
    }
}
