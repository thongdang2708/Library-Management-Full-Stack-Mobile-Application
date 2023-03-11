package com.example.library.backend.service;

import com.example.library.backend.entity.Review;
import com.example.library.backend.message.CheckResponse;
import java.util.List;

public interface ReviewService {

    Review addReview(Long customerId, Long bookId, Review review);

    CheckResponse checkReviewWithCustomer(Long customerId);

    List<Review> getAllReviewsByBookId(Long bookId);

    void deleteReview(Long id);

    CheckResponse checkReviewBookByCustomer(Long bookId, Long customerId);

}
