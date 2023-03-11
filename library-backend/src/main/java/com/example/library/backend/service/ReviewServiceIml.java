package com.example.library.backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.library.backend.entity.Book;
import com.example.library.backend.entity.Customer;
import com.example.library.backend.entity.Review;
import com.example.library.backend.exception.NotImplementedWithException;
import com.example.library.backend.message.CheckResponse;
import com.example.library.backend.repository.BookRepository;
import com.example.library.backend.repository.ReviewRepository;

@Service
public class ReviewServiceIml implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private BookService bookService;

    @Override
    public Review addReview(Long customerId, Long bookId, Review review) {

        Customer customer = customerService.getCustomerWithId(customerId);
        Book book = bookService.getSingleBook(bookId);

        if (reviewRepository.existsReviewByCustomerIdAndBookId(customerId, bookId)) {
            throw new NotImplementedWithException(
                    "Cannot add more review as this user id " + customerId + " added a review already!");
        }
        review.setBook(book);
        review.setCustomer(customer);

        return reviewRepository.save(review);
    }

    @Override
    public CheckResponse checkReviewWithCustomer(Long customerId) {

        Boolean check = reviewRepository.existsReviewByCustomerId(customerId);

        return new CheckResponse(check);
    }

    @Override
    public List<Review> getAllReviewsByBookId(Long bookId) {
        return reviewRepository.findByBookId(bookId);
    }

    @Override
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

    @Override
    public CheckResponse checkReviewBookByCustomer(Long bookId, Long customerId) {
        boolean existsReviewByBookAndCustomer = reviewRepository.existsReviewByCustomerIdAndBookId(customerId, bookId);

        if (existsReviewByBookAndCustomer) {
            return new CheckResponse(true);
        }

        return new CheckResponse(false);
    }

  

}
