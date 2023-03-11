package com.example.library.backend.controller;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.library.backend.entity.Customer;
import com.example.library.backend.entity.RefreshToken;
import com.example.library.backend.entity.RegistrationInformation;
import com.example.library.backend.entity.RegistrationInformationAdmin;
import com.example.library.backend.message.CheckResponse;
import com.example.library.backend.message.EmailActivationMessage;
import com.example.library.backend.message.ResponseMessage;
import com.example.library.backend.service.RegistrationService;
import com.example.library.backend.service.UserService;
import java.util.List;
import jakarta.annotation.security.PermitAll;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private RegistrationService registrationService;

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ResponseMessage> registerUser(
            @Valid @RequestBody RegistrationInformation registrationInformation) {

        String registerMessage = registrationService.signUpUser(registrationInformation);

        ResponseMessage responseMessage = new ResponseMessage(Arrays.asList(registerMessage));

        return new ResponseEntity<>(responseMessage, HttpStatus.CREATED);

    }

    @PostMapping("/admin/register")
    @PreAuthorize("permitAll()")
    public ResponseEntity<ResponseMessage> registerUserAsAdmin(
            @Valid @RequestBody RegistrationInformationAdmin registrationInformationAdmin) {

        String registerMessage = registrationService.signUpUserAsAdmin(registrationInformationAdmin);

        ResponseMessage responseMessage = new ResponseMessage(Arrays.asList(registerMessage));

        return new ResponseEntity<>(responseMessage, HttpStatus.CREATED);

    }

    @PostMapping("/refreshToken")
    @PermitAll
    public ResponseEntity<Object> getRefreshToken(@Valid @RequestBody RefreshToken refreshToken) {

        return new ResponseEntity<>(registrationService.getRefreshToken(refreshToken), HttpStatus.OK);
    }

    @GetMapping("/test")
    @PreAuthorize("hasAuthority('user')")
    public String testAPI() {

        return "Hello Java Spring Boot";
    }

    @GetMapping("/confirmationToken")
    @PreAuthorize("permitAll()")
    public String getConfirmationToken(
            @RequestParam(value = "token", required = false) String token) {

        EmailActivationMessage emailActivationMessage = registrationService.getConfirmationToken(token);

        return buildMessage(emailActivationMessage);
    }

    @GetMapping("/admin/confirmationToken")
    @PreAuthorize("permitAll()")
    public String getConfirmationTokenForAdmin(@RequestParam(value = "token", required = false) String token) {

        EmailActivationMessage emailActivationMessage = registrationService.getConfirmationTokenForAdmin(token);

        return buildMessage(emailActivationMessage);
    }

    public String buildMessage(EmailActivationMessage emailActivationMessage) {

        return "<div style=\"font-family:Helvetica,Arial,sans-serif;font-size:16px;margin:0;color:#0b0c0c\">\n"
                +
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
                + emailActivationMessage.getUsername()
                + ",</p><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\">"
                + emailActivationMessage.getMessage()
                + "</p><blockquote style=\"Margin:0 0 20px 0;border-left:10px solid #b1b4b6;padding:15px 0 0.1px 15px;font-size:19px;line-height:25px\"><p style=\"Margin:0 0 20px 0;font-size:19px;line-height:25px;color:#0b0c0c\"> </p></blockquote>\n Link will expire in 15 minutes. <p>See you soon</p>"
                +
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

    @GetMapping("/{id}/getCustomer")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<Object> getUser(@PathVariable Long id) {

        return new ResponseEntity<>(userService.getUser(id), HttpStatus.OK);
    }

    @GetMapping("/{id}/getAdmin")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<Object> getAdmin(@PathVariable Long id) {

        return new ResponseEntity<>(userService.getAdmin(id), HttpStatus.OK);
    }

    @GetMapping("/logout")
    public ResponseEntity<HttpStatus> logOut() {
        userService.logout();
        return new ResponseEntity<HttpStatus>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/checkIsAdmin/{id}")
    @PreAuthorize("hasAuthority('user') or hasAuthority('admin')")
    public ResponseEntity<CheckResponse> checkIsAdmin(@PathVariable Long id) {

        return new ResponseEntity<CheckResponse>(userService.checkIsAdmin(id), HttpStatus.OK);
    }

    @GetMapping("/allCustomers")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<List<Customer>> getAllCustomers() {

        return new ResponseEntity<>(userService.getAllCustomers(), HttpStatus.OK);
    }

    @DeleteMapping("/deleteCustomer/customer/{customerId}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<HttpStatus> deleteCustomer(@PathVariable Long customerId) {
        userService.deleteCustomers(customerId);
        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

}
