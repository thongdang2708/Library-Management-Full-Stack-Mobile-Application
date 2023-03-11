package com.example.library.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.library.backend.entity.Customer;
import com.example.library.backend.exception.NotFoundWithException;
import com.example.library.backend.repository.CustomerRepository;

@Service
public class CustomerServiceIml implements CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    @Override
    public Customer getCustomerWithId(Long id) {

        Optional<Customer> customer = customerRepository.findById(id);

        if (customer.isPresent()) {
            return customer.get();
        } else {
            throw new NotFoundWithException("This customer with this " + id + " does not exist!");
        }
    }
}
