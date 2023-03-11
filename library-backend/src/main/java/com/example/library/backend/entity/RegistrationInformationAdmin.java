package com.example.library.backend.entity;

import com.example.library.backend.validator.CheckPassword;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class RegistrationInformationAdmin {

    @NotBlank(message = "Secret key must not be blank!")
    private String secretKey;

    @NotBlank(message = "Email must not be blank!")
    @Email(message = "Email is invalid!")
    private String email;

    @NotBlank(message = "Email must not be blank!")
    private String username;

    @NotBlank(message = "Email must not be blank!")
    @CheckPassword(message = "Password is invalid as it should contain at least a capital letter, at least a small letter, at least a number, at least a special character, and its minimum length is 8")
    private String password;
}
