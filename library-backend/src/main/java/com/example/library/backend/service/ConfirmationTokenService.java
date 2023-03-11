package com.example.library.backend.service;

import com.example.library.backend.entity.ConfirmationToken;

public interface ConfirmationTokenService {
    ConfirmationToken getConfirmationTokenByToken(String token);

}
