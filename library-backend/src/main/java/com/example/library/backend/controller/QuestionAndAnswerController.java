package com.example.library.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;
import com.example.library.backend.entity.Answer;
import com.example.library.backend.entity.Question;
import com.example.library.backend.entity.QuestionAndAnswer;
import com.example.library.backend.service.QuestionAndAnswerService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/quiz")
public class QuestionAndAnswerController {

    @Autowired
    private QuestionAndAnswerService questionAndAnswerService;

    @PostMapping("/addQuestion/customer/{customerId}")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<Object> addQuestion(@Valid @RequestBody Question question, @PathVariable Long customerId) {

        return new ResponseEntity<>(questionAndAnswerService.addQuestion(question, customerId), HttpStatus.OK);
    }

    @PostMapping("/{id}/addAnswer/admin/{adminId}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<Object> addAnswer(@Valid @RequestBody Answer answer, @PathVariable Long id,
            @PathVariable Long adminId) {

        return new ResponseEntity<>(questionAndAnswerService.answerQuestion(answer, adminId, id), HttpStatus.OK);
    }

    @GetMapping("/all")
    @PreAuthorize("hasAuthority('user') or hasAuthority('admin')")
    public ResponseEntity<List<QuestionAndAnswer>> getAllQAndA() {

        return new ResponseEntity<>(questionAndAnswerService.getAllQuestionsAndAnswers(), HttpStatus.OK);
    }

    @GetMapping("/unansweredQuiz")
    @PreAuthorize("hasAuthority('user') or hasAuthority('admin')")
    public ResponseEntity<List<QuestionAndAnswer>> getAllUnansweredQuiz() {

        return new ResponseEntity<>(questionAndAnswerService.getUnansweredQuestion(), HttpStatus.OK);
    }

    @GetMapping("/answeredQuiz")
    @PreAuthorize("hasAuthority('user') or hasAuthority('admin')")
    public ResponseEntity<List<QuestionAndAnswer>> getAllAnsweredQuiz() {

        return new ResponseEntity<>(questionAndAnswerService.getAnsweredQuestion(), HttpStatus.OK);
    }
}
