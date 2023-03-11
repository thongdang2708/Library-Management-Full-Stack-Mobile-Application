package com.example.library.backend.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.library.backend.entity.Book;
import com.example.library.backend.entity.CheckoutBook;
import com.example.library.backend.entity.Customer;
import com.example.library.backend.entity.History;
import com.example.library.backend.repository.HistoryRepository;

@Service
public class HistoryServiceIml implements HistoryService {

    @Autowired
    private HistoryRepository historyRepository;

    @Autowired
    private BookService bookService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private CheckoutBookService checkoutBookService;

    @Override
    public History addHistory(Long id, Long bookId, Long customerId) {
        Book book = bookService.getSingleBook(bookId);

        Customer customer = customerService.getCustomerWithId(customerId);

        CheckoutBook checkoutBook = checkoutBookService.getSingleCheckoutBook(id, bookId, customerId);

        History history = new History();

        history.setBookName(book.getName());
        history.setBorrowDate(checkoutBook.getBorrowDate());
        history.setReturnDate(LocalDate.now());
        history.setBook(book);
        history.setCustomer(customer);

        return historyRepository.save(history);

    }

    @Override
    public List<History> getAllHistoriesByCustomerId(Long customerId) {

        return historyRepository.findByCustomerId(customerId);
    }
}
