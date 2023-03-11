package com.example.library.backend.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.example.library.backend.entity.Book;
import com.example.library.backend.entity.CheckoutBook;
import com.example.library.backend.entity.Customer;
import com.example.library.backend.exception.NotFoundWithException;
import com.example.library.backend.exception.NotImplementedWithException;
import com.example.library.backend.message.CheckResponse;
import com.example.library.backend.message.CheckReturnDate;
import com.example.library.backend.message.CountCheckoutResponse;
import com.example.library.backend.repository.BookRepository;
import com.example.library.backend.repository.CheckoutBookRepository;

import jakarta.validation.constraints.Null;

@Service
public class CheckoutBookServiceIml implements CheckoutBookService {

    @Autowired
    private CheckoutBookRepository checkoutBookRepository;

    @Autowired
    private BookService bookService;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private CustomerService customerService;

    @Value("${limit.borrow}")
    private String limitBorrow;

    @Override
    public CheckoutBook addCheckoutBook(Long bookId, Long customerId) {
        // TODO Auto-generated method stub
        Book book = bookService.getSingleBook(bookId);
        Customer customer = customerService.getCustomerWithId(customerId);

        if (book.getAvailableQuantity() == 0) {
            throw new NotImplementedWithException(
                    "Book is out of stock. So cannot borrow at this time! Please come back when it is refilled!");
        }

        if (checkoutBookRepository.existsCheckoutBookByCustomerId(customerId)
                && checkoutBookRepository.findByCustomerIdAndIsReturned(customerId, false).size() > (Integer
                        .parseInt(limitBorrow) - 1)) {
            throw new NotImplementedWithException(
                    "It reaches the limit of customers to borrow book! Cannot borrow anymore!");
        }
        ;

        if (checkoutBookRepository.existsCheckoutBookByBookIdAndCustomerIdAndIsReturned(bookId, customerId, false)) {
            throw new NotImplementedWithException(
                    "Cannot borrow this book at this moment as you borrowed this book before!");
        }

        CheckoutBook checkoutBook = new CheckoutBook();

        checkoutBook.setBookName(book.getName());

        book.setAvailableQuantity(book.getAvailableQuantity() - 1);
        bookRepository.save(book);

        checkoutBook.setBorrowDate(LocalDate.now());
        checkoutBook.setDateToReturn(LocalDate.now().plusDays(book.getBorrowLength()));
        checkoutBook.setCustomer(customer);
        checkoutBook.setBook(book);

        return checkoutBookRepository.save(checkoutBook);
    }

    @Override
    public CheckoutBook getSingleCheckoutBook(Long id, Long bookId, Long customerId) {
        Optional<CheckoutBook> checkoutBook = checkoutBookRepository.findByIdAndBookIdAndCustomerId(id, bookId,
                customerId);

        if (checkoutBook.isPresent()) {
            return checkoutBook.get();
        } else {
            throw new NotFoundWithException(
                    "This check out with book id " + bookId + " and customer id " + customerId + " does not exist!");
        }
    }

    @Override
    public CheckReturnDate checkBookIsReturnOnTime(Long id, Long bookId, Long customerId) {

        CheckoutBook checkoutBook2 = getSingleCheckoutBook(id, bookId, customerId);
        Long diff = ChronoUnit.DAYS.between(LocalDate.now(), checkoutBook2.getDateToReturn());
        if (checkoutBook2.getDateToReturn().isBefore(LocalDate.now()) && checkoutBook2.getReturnDate() == null
                && !checkoutBook2.getIsReturned()) {
            return new CheckReturnDate(false, diff);
        } else {
            return new CheckReturnDate(true, diff);
        }

    }

    @Override
    public CheckResponse checkBookIsBorrowed(Long bookId, Long customerId) {

        if (checkoutBookRepository.existsCheckoutBookByBookIdAndCustomerIdAndIsReturned(bookId, customerId, false)) {
           return new CheckResponse(true);
        } else {
            return new CheckResponse(false);
        }
    }

    @Override
    public CheckoutBook returnBook(Long id, Long bookId, Long customerId) {
        CheckoutBook checkoutBook = getSingleCheckoutBook(id, bookId, customerId);
        Book book = bookService.getSingleBook(bookId);

        checkoutBook.setReturnDate(LocalDate.now());
        checkoutBook.setIsReturned(true);

        if (book.getQuantity() <= book.getAvailableQuantity()) {
            book.setAvailableQuantity(book.getAvailableQuantity() + 1);
            book.setQuantity(book.getAvailableQuantity());
            bookRepository.save(book);
        } else {
            book.setAvailableQuantity(book.getAvailableQuantity() + 1);
            bookRepository.save(book);
        }

        return checkoutBookRepository.save(checkoutBook);
    }

    @Override
    public CheckoutBook setExtendedForBook(Long id, Long bookId, Long customerId) {
        CheckoutBook checkoutBook = getSingleCheckoutBook(id, bookId, customerId);
        Book book = bookService.getSingleBook(bookId);

        if (checkoutBook.getIsReturned() == true) {
            throw new NotImplementedWithException("Cannot extend as this book is already returned!");
        }

        checkoutBook.setBorrowDate(LocalDate.now());
        checkoutBook.setDateToReturn(LocalDate.now().plusDays(book.getBorrowLength()));

        return checkoutBookRepository.save(checkoutBook);
    }

    @Override
    public List<CheckoutBook> getAllCheckoutByCustomerId(Long customerId) {
        return checkoutBookRepository.findByCustomerId(customerId);
    }

    @Override
    public CountCheckoutResponse countCheckoutsByCustomerId(Long customerId) {

        boolean existsCustomerId = checkoutBookRepository.existsCheckoutBookByCustomerId(customerId);

        List<CheckoutBook> checkoutBooks = checkoutBookRepository.findByCustomerIdAndIsReturned(customerId, false);

        if (!existsCustomerId) {
            return new CountCheckoutResponse(customerId, 0, Integer.parseInt(limitBorrow));
        }

        return new CountCheckoutResponse(customerId, checkoutBooks.size(), Integer.parseInt(limitBorrow));

    }
}
