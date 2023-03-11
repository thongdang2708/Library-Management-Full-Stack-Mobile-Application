package com.example.library.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.library.backend.entity.ConfirmationToken;
import com.example.library.backend.exception.NotFoundWithException;
import com.example.library.backend.repository.ConfirmationTokenRepository;

@Service
public class ConfirmationTokenServiceIml implements ConfirmationTokenService {
    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Override
    public ConfirmationToken getConfirmationTokenByToken(String token) {
        Optional<ConfirmationToken> confirmationToken = confirmationTokenRepository.findByToken(token);

        if (confirmationToken.isPresent()) {
            return confirmationToken.get();
        } else {
            throw new NotFoundWithException("This confirmation token " + token + " does not exist!");
        }
    }
}
