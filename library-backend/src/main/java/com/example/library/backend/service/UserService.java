package com.example.library.backend.service;

import com.example.library.backend.entity.Customer;
import com.example.library.backend.entity.RegistrationInformation;
import com.example.library.backend.entity.User;
import com.example.library.backend.message.CheckResponse;
import com.example.library.backend.message.UserResponse;
import java.util.List;

public interface UserService {
    String registerUser(RegistrationInformation registrationInformation);

    String registerUserAsAdmin(RegistrationInformation registrationInformation);

    User getUserByEmail(String email);

    User getUserById(Long id);

    void logout();

    CheckResponse checkIsAdmin(Long id);

    UserResponse getAdmin(Long id);

    UserResponse getUser(Long id);

    List<Customer> getAllCustomers();

    void deleteCustomers(Long customerId);
}
