package com.example.library.backend.controller;

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
import org.springframework.web.bind.annotation.RestController;

import com.example.library.backend.entity.Review;
import com.example.library.backend.message.ReviewResponse;
import com.example.library.backend.message.UserForReview;
import com.example.library.backend.service.ReviewService;
import java.util.List;
import java.util.ArrayList;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    @PostMapping("/customer/{customerId}/book/{bookId}")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<Object> addReview(@PathVariable Long customerId, @PathVariable Long bookId,
            @Valid @RequestBody Review review) {

        Review createdReview = reviewService.addReview(customerId, bookId, review);

        UserForReview userForReview = new UserForReview(createdReview.getCustomer().getUser().getId(),
                createdReview.getCustomer().getUser().getUsername());

        ReviewResponse reviewResponse = new ReviewResponse(createdReview, userForReview);

        return new ResponseEntity<>(reviewResponse, HttpStatus.CREATED);
    }

    @GetMapping("/checkCustomer/{customerId}")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<Object> getCheckCustomer(@PathVariable Long customerId) {

        return new ResponseEntity<>(reviewService.checkReviewWithCustomer(customerId), HttpStatus.OK);
    }

    @GetMapping("/all/book/{bookId}")
    @PreAuthorize("permitAll()")
    public ResponseEntity<List<ReviewResponse>> getAllReviewsOfBook(@PathVariable Long bookId) {

        List<Review> reviews = reviewService.getAllReviewsByBookId(bookId);

        List<ReviewResponse> reviewResponses = new ArrayList<>();

        for (Review review : reviews) {

            UserForReview userForReview = new UserForReview(review.getCustomer().getUser().getId(),
                    review.getCustomer().getUser().getUsername());

            ReviewResponse reviewResponse = new ReviewResponse(review, userForReview);

            reviewResponses.add(reviewResponse);

        }

        return new ResponseEntity<>(reviewResponses, HttpStatus.OK);
    }

    @GetMapping("/check/book/{bookId}/customer/{customerId}")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<Object> checkReviewWithBookAndCustomer(@PathVariable Long bookId,
            @PathVariable Long customerId) {

        return new ResponseEntity<>(reviewService.checkReviewBookByCustomer(bookId, customerId), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<HttpStatus> deleteReview(@PathVariable Long id) {

        reviewService.deleteReview(id);
        return new ResponseEntity<HttpStatus>(HttpStatus.NO_CONTENT);
    }

}
