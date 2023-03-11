package com.example.library.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.library.backend.entity.Review;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    boolean existsReviewByCustomerId(Long customerId);

    boolean existsReviewByCustomerIdAndBookId(Long customerId, Long bookId);

    List<Review> findByBookId(Long bookId);
}
