package com.example.library.backend.service;

import java.time.LocalDateTime;

import org.apache.poi.ss.formula.eval.NotImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.example.library.backend.entity.Admin;
import com.example.library.backend.entity.ConfirmationToken;
import com.example.library.backend.entity.Customer;
import com.example.library.backend.entity.RefreshToken;
import com.example.library.backend.entity.RegistrationInformation;
import com.example.library.backend.entity.RegistrationInformationAdmin;
import com.example.library.backend.entity.Role;
import com.example.library.backend.exception.BadRequestWithException;
import com.example.library.backend.message.EmailActivationMessage;
import com.example.library.backend.message.TokenResponse;
import com.example.library.backend.repository.AdminRepository;
import com.example.library.backend.repository.ConfirmationTokenRepository;
import com.example.library.backend.repository.CustomerRepository;
import com.example.library.backend.repository.UserRepository;
import com.google.gson.Gson;

import jakarta.servlet.http.HttpServletResponse;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class RegistrationServiceIml implements RegistrationService {

    @Autowired
    private UserService userService;

    @Autowired
    private EmailSenderService emailSenderService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Autowired
    private ConfirmationTokenService confirmationTokenService;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private AdminRepository adminRepository;

    @Autowired
    private HttpServletResponse response;

    @Value("${JWT.secretKey}")
    private String secretKey;

    @Value("${JWT.expiration}")
    private String JWTexpiration;

    @Value("${host.url}")
    private String hostURL;

    @Value("${secret.key.admin}")
    private String secretKeyAdmin;

    @Override
    public String signUpUser(RegistrationInformation registrationInformation) {

        String token = userService.registerUser(registrationInformation);

        String link = hostURL + "/auth/confirmationToken?token=" + token;

        emailSenderService.sendEmail(registrationInformation.getEmail(),
                buildEmail(registrationInformation.getUsername(), link));

        return "Register successfully! Please check your email!";
    }

    @Override
    public String signUpUserAsAdmin(RegistrationInformationAdmin registrationInformationAdmin) {
        // TODO Auto-generated method stub
        if (!registrationInformationAdmin.getSecretKey().equals(secretKeyAdmin)) {
            throw new BadRequestWithException(
                    "Secret key does not match! So you are not allowed to register admin account!");
        }

        RegistrationInformation registrationInformation = new RegistrationInformation(
                registrationInformationAdmin.getEmail(), registrationInformationAdmin.getUsername(),
                registrationInformationAdmin.getPassword());

        String token = userService.registerUserAsAdmin(registrationInformation);

        String link = hostURL + "/auth/admin/confirmationToken?token=" + token;

        emailSenderService.sendEmail(registrationInformation.getEmail(),
                buildEmail(registrationInformation.getUsername(), link));

        return "Register an admin account successfully! Please check your email";
    }

    @Override
    public TokenResponse getRefreshToken(RefreshToken refreshToken) {
        // TODO Auto-generated method stub
        try {

            String id = JWT.require(Algorithm.HMAC512(secretKey))
                    .build()
                    .verify(refreshToken.getRefreshToken())
                    .getSubject();

            List<String> roles = JWT.require(Algorithm.HMAC512(secretKey))
                    .build()
                    .verify(refreshToken.getRefreshToken())
                    .getClaim("roles")
                    .asList(String.class);

            String access_token = JWT.create()
                    .withSubject(id)
                    .withExpiresAt(new Date(System.currentTimeMillis() + Integer.parseInt(JWTexpiration)))
                    .withClaim("roles", roles)
                    .sign(Algorithm.HMAC512(secretKey));

            String refresh_token = JWT.create()
                    .withSubject(id)
                    .withExpiresAt(new Date(System.currentTimeMillis() + (Integer.parseInt(JWTexpiration) * 2)))
                    .withClaim("roles", roles)
                    .sign(Algorithm.HMAC512(secretKey));

            response.setHeader("access_token", access_token);
            response.setHeader("refresh_token", refresh_token);

            TokenResponse tokenResponse = new TokenResponse(Long.parseLong(id), access_token, refresh_token);

            return tokenResponse;

        } catch (JWTVerificationException ex) {
            throw new NotImplementedException("This token is invalid or out of date! Please check again!");
        }
    }

    public String buildEmail(String username, String link) {

        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n" +
                "\n" +
                "<span style=\"display:none;font-size:1px;color:#fff;max-height:0\"></span>\n" +
                "\n" +
                "  <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;min-width:100%;width:100%!important\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\">\n"
                +
                "    <tbody><tr>\n" +
                "      <td width=\"100%\" height=\"53\" bgcolor=\"#0b0c0c\">\n" +
                "        \n" +
                "        <table role=\"presentation\" width=\"100%\" style=\"border-collapse:collapse;max-width:580px\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" align=\"center\">\n"
                +
                "          <tbody><tr>\n" +
                "            <td width=\"70\" bgcolor=\"#0b0c0c\" valign=\"middle\">\n" +
                "                <table role=\"presentation\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n"
                +
                "                  <tbody><tr>\n" +
                "                    <td style=\"padding-left:10px\">\n" +
                "                  \n" +
                "                    </td>\n" +
                "                    <td style=\"font-size:28px;line-height:1.315789474;Margin-top:4px;padding-left:10px\">\n"
                +
                "                      <span style=\"font-family:Helvetica,Arial,sans-serif;font-weight:700;color:#ffffff;text-decoration:none;vertical-align:top;display:inline-block\">Confirm your email</span>\n"
                +
                "                    </td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "              </a>\n" +
                "            </td>\n" +
                "          </tr>\n" +
                "        </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n"
                +
                "    <tbody><tr>\n" +
                "      <td width=\"10\" height=\"10\" valign=\"middle\"></td>\n" +
                "      <td>\n" +
                "        \n" +
                "                <table role=\"presentation\" width=\"100%\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse\">\n"
                +
                "                  <tbody><tr>\n" +
                "                    <td bgcolor=\"#1D70B8\" width=\"100%\" height=\"10\"></td>\n" +
                "                  </tr>\n" +
                "                </tbody></table>\n" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\" height=\"10\"></td>\n" +
                "    </tr>\n" +
                "  </tbody></table>\n" +
                "\n" +
                "\n" +
                "\n" +
                "  <table role=\"presentation\" class=\"m_-6186904992287805515content\" align=\"center\" cellpadding=\"0\" cellspacing=\"0\" border=\"0\" style=\"border-collapse:collapse;max-width:580px;width:100%!important\" width=\"100%\">\n"
                +
                "    <tbody><tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "      <td style=\"font-family:Helvetica,Arial,sans-serif;font-size:19px;line-height:1.315789474;max-width:560px\">\n"
                +
                "        \n" +
                "            <p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">Hi "
                + username
                + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> Thank you for registering. Please click on the below link to activate your account: </p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> <a href=\""
                + link + "\">Activate Now</a> </p></blockquote>\n Link will expire in 15 minutes. <p>See you soon</p>" +
                "        \n" +
                "      </td>\n" +
                "      <td width=\"10\" valign=\"middle\"><br></td>\n" +
                "    </tr>\n" +
                "    <tr>\n" +
                "      <td height=\"30\"><br></td>\n" +
                "    </tr>\n" +
                "  </tbody></table><div class=\"yj6qo\"></div><div class=\"adL\">\n" +
                "\n" +
                "</div></div>";

    }

    @Override
    public EmailActivationMessage getConfirmationToken(String token) {
        Optional<ConfirmationToken> forCheckToken = confirmationTokenRepository.findByToken(token);

        if (forCheckToken.isPresent()) {
            ConfirmationToken confirmationToken = forCheckToken.get();

            if (confirmationToken.getConfirmedAt() != null) {
                return new EmailActivationMessage(confirmationToken.getUser().getUsername(),
                        "This email is already activated!");
            }

            if (confirmationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
                return new EmailActivationMessage(confirmationToken.getUser().getUsername(),
                        "This token expires already. The token is only valid within 15 minutes!");
            }

            userRepository.updateChecksWithEmail(confirmationToken.getUser().getEmail());
            confirmationTokenRepository.updateConfirmedAtByToken(LocalDateTime.now(), token);

            List<Role> roles = new ArrayList<>();

            for (Role role : confirmationToken.getUser().getRoles()) {
                roles.add(role);
            }
            ;

            String nameRole = roles.get(0).getRole();

            Customer customer = new Customer(nameRole, confirmationToken.getUser());

            confirmationToken.getUser().setCustomer(customer);

            userRepository.save(confirmationToken.getUser());

            return new EmailActivationMessage(confirmationToken.getUser().getUsername(),
                    "Thank you! You activated your email successfully!");
        } else {
            return new EmailActivationMessage("",
                    "Something is wrong with token or user is not registerd yet!");
        }

    }

    @Override
    public EmailActivationMessage getConfirmationTokenForAdmin(String token) {
        Optional<ConfirmationToken> forCheckToken = confirmationTokenRepository.findByToken(token);

        if (forCheckToken.isPresent()) {
            ConfirmationToken confirmationToken = forCheckToken.get();

            if (confirmationToken.getConfirmedAt() != null) {
                return new EmailActivationMessage(confirmationToken.getUser().getUsername(),
                        "This email is already activated!");
            }

            if (confirmationToken.getExpiresAt().isBefore(LocalDateTime.now())) {
                return new EmailActivationMessage(confirmationToken.getUser().getUsername(),
                        "This token expires already. The token is only valid within 15 minutes!");
            }

            userRepository.updateChecksWithEmail(confirmationToken.getUser().getEmail());
            confirmationTokenRepository.updateConfirmedAtByToken(LocalDateTime.now(), token);

            List<Role> roles = new ArrayList<>();

            for (Role role : confirmationToken.getUser().getRoles()) {
                roles.add(role);
            }
            ;

            String nameRole = roles.get(0).getRole();

            Admin admin = new Admin(nameRole, confirmationToken.getUser());
            confirmationToken.getUser().setAdmin(admin);

            userRepository.save(confirmationToken.getUser());

            return new EmailActivationMessage(confirmationToken.getUser().getUsername(),
                    "Thank you! You activated your email successfully!");

        } else {
            return new EmailActivationMessage("",
                    "Something is wrong with token or user is not registerd yet!");
        }
    }
}
