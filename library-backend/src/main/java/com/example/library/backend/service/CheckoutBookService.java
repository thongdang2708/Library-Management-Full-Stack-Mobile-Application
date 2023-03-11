package com.example.library.backend.service;

import com.example.library.backend.entity.CheckoutBook;
import java.util.List;
import com.example.library.backend.message.CheckResponse;
import com.example.library.backend.message.CheckReturnDate;
import com.example.library.backend.message.CountCheckoutResponse;

public interface CheckoutBookService {

    CheckoutBook addCheckoutBook(Long bookId, Long customerId);

    CheckReturnDate checkBookIsReturnOnTime(Long id, Long bookId, Long customerId);

    CheckResponse checkBookIsBorrowed(Long bookId, Long customerId);

    CheckoutBook returnBook(Long id, Long bookId, Long customerId);

    CheckoutBook getSingleCheckoutBook(Long id, Long bookId, Long customerId);

    CheckoutBook setExtendedForBook(Long id, Long bookId, Long customerId);

    List<CheckoutBook> getAllCheckoutByCustomerId(Long customerId);

    CountCheckoutResponse countCheckoutsByCustomerId(Long customerId);

}
