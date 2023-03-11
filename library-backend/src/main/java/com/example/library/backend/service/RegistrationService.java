package com.example.library.backend.service;

import com.example.library.backend.entity.RefreshToken;
import com.example.library.backend.entity.RegistrationInformation;
import com.example.library.backend.entity.RegistrationInformationAdmin;
import com.example.library.backend.message.EmailActivationMessage;
import com.example.library.backend.message.TokenResponse;

public interface RegistrationService {
    String signUpUser(RegistrationInformation registrationInformation);

    EmailActivationMessage getConfirmationToken(String token);

    String signUpUserAsAdmin(RegistrationInformationAdmin registrationInformationAdmin);

    EmailActivationMessage getConfirmationTokenForAdmin(String token);

    TokenResponse getRefreshToken(RefreshToken refreshToken);
}
