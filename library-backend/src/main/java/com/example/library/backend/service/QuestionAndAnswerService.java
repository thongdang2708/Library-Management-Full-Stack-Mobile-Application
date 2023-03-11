package com.example.library.backend.service;

import com.example.library.backend.entity.Answer;
import com.example.library.backend.entity.Question;
import com.example.library.backend.entity.QuestionAndAnswer;
import com.example.library.backend.entity.QuestionAnswerRequest;
import java.util.List;

public interface QuestionAndAnswerService {

    QuestionAndAnswer addQuestion(Question question, Long customerID);

    QuestionAndAnswer getSingleQuestion(Long id);

    QuestionAndAnswer answerQuestion(Answer answer, Long adminId, Long id);

    List<QuestionAndAnswer> getAllQuestionsAndAnswers();

    List<QuestionAndAnswer> getUnansweredQuestion();

    List<QuestionAndAnswer> getAnsweredQuestion();
}
