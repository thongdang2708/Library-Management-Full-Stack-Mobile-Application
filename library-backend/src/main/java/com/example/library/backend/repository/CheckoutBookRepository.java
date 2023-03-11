package com.example.library.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

import com.example.library.backend.entity.CheckoutBook;

import jakarta.transaction.Transactional;

@Repository
public interface CheckoutBookRepository extends CrudRepository<CheckoutBook, Long> {

    Optional<CheckoutBook> findByIdAndBookIdAndCustomerId(Long id, Long bookId, Long customerId);

    boolean existsCheckoutBookByIdAndBookIdAndCustomerId(Long id, Long bookId, Long customerId);

    boolean existsCheckoutBookByCustomerId(Long customerId);

    boolean existsCheckoutBookByBookIdAndCustomerIdAndIsReturned(Long bookId, Long customerId, boolean isReturned);

    boolean existsCheckoutBookByBookIdAndCustomerId(Long bookId, Long customerId);

    List<CheckoutBook> findByCustomerId(Long customerId);

    List<CheckoutBook> findByCustomerIdAndIsReturned(Long customerId, Boolean isReturned);

}
