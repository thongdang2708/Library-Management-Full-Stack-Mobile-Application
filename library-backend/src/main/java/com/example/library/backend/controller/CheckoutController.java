package com.example.library.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

import com.example.library.backend.entity.CheckoutBook;
import com.example.library.backend.service.CheckoutBookService;

@RestController
@RequestMapping("/api/v1/checkout")
public class CheckoutController {

    @Autowired
    private CheckoutBookService checkoutBookService;

    @PostMapping("/book/{bookId}/customer/{customerId}")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<Object> addBook(@PathVariable Long bookId, @PathVariable Long customerId) {

        return new ResponseEntity<>(checkoutBookService.addCheckoutBook(bookId, customerId), HttpStatus.OK);
    }

    @GetMapping("/{id}/checkReturnOnTime/book/{bookId}/customer/{customerId}")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<Object> checkBookReturnOnTime(@PathVariable Long id, @PathVariable Long bookId,
            @PathVariable Long customerId) {

        return new ResponseEntity<>(checkoutBookService.checkBookIsReturnOnTime(id, bookId, customerId), HttpStatus.OK);
    }

    @GetMapping("/checkIsBorrowed/book/{bookId}/customer/{customerId}")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<Object> checkBookIsBorrow(@PathVariable Long bookId,
            @PathVariable Long customerId) {

        return new ResponseEntity<>(checkoutBookService.checkBookIsBorrowed(bookId, customerId), HttpStatus.OK);
    }

    @GetMapping("/{id}/returnBook/book/{bookId}/customer/{customerId}")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<Object> returnBook(@PathVariable Long id, @PathVariable Long bookId,
            @PathVariable Long customerId) {

        return new ResponseEntity<>(checkoutBookService.returnBook(id, bookId, customerId), HttpStatus.OK);
    }

    @GetMapping("/{id}/setExtended/book/{bookId}/customer/{customerId}")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<Object> setExtendedBook(@PathVariable Long id, @PathVariable Long bookId,
            @PathVariable Long customerId) {

        return new ResponseEntity<>(checkoutBookService.setExtendedForBook(id, bookId, customerId), HttpStatus.OK);
    }

    @GetMapping("/getAllCheckout/customer/{customerId}")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<List<CheckoutBook>> getAllCheckoutsOfCustomers(@PathVariable Long customerId) {

        return new ResponseEntity<>(checkoutBookService.getAllCheckoutByCustomerId(customerId), HttpStatus.OK);
    }

    @GetMapping("/all/customer/{customerId}")
    public ResponseEntity<Object> getCountCheckOutsOfCustomer(@PathVariable Long customerId) {

        return new ResponseEntity<>(checkoutBookService.countCheckoutsByCustomerId(customerId), HttpStatus.OK);
    }
}
