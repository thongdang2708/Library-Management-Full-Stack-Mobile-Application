package com.example.library.backend.service;

import com.example.library.backend.entity.Customer;

public interface CustomerService {
    Customer getCustomerWithId(Long id);
}
