package com.example.library.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.library.backend.entity.QuestionAndAnswer;
import java.util.List;

@Repository
public interface QuestionAndAnswerRepository extends JpaRepository<QuestionAndAnswer, Long> {

    List<QuestionAndAnswer> findByStatus(String status);

    List<QuestionAndAnswer> findByCustomerId(Long customerId);

}
