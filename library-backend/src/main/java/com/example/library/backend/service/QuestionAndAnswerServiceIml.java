package com.example.library.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.library.backend.entity.Admin;
import com.example.library.backend.entity.Answer;
import com.example.library.backend.entity.Customer;
import com.example.library.backend.entity.Question;
import com.example.library.backend.entity.QuestionAndAnswer;
import com.example.library.backend.entity.QuestionAnswerRequest;
import com.example.library.backend.exception.NotFoundWithException;
import com.example.library.backend.repository.QuestionAndAnswerRepository;

@Service
public class QuestionAndAnswerServiceIml implements QuestionAndAnswerService {

    @Autowired
    private QuestionAndAnswerRepository questionAndAnswerRepository;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private AdminService adminService;

    @Override
    public QuestionAndAnswer addQuestion(Question question, Long customerId) {

        Customer customer = customerService.getCustomerWithId(customerId);

        QuestionAndAnswer questionAndAnswer = new QuestionAndAnswer();

        questionAndAnswer.setQuestion(question.getQuestion());
        questionAndAnswer.setCustomer(customer);

        return questionAndAnswerRepository.save(questionAndAnswer);

    }

    @Override
    public QuestionAndAnswer getSingleQuestion(Long id) {
        Optional<QuestionAndAnswer> questionAndAnswer = questionAndAnswerRepository.findById(id);

        if (questionAndAnswer.isPresent()) {
            return questionAndAnswer.get();
        } else {
            throw new NotFoundWithException("Q/A cannot be found!");
        }
    }

    @Override
    public QuestionAndAnswer answerQuestion(Answer answer, Long adminId, Long id) {
        Admin admin = adminService.getAdminWithId(adminId);

        QuestionAndAnswer questionAndAnswer = getSingleQuestion(id);

        questionAndAnswer.setAnswer(answer.getAnswer());
        questionAndAnswer.setAdmin(admin);
        questionAndAnswer.setStatus("answered");

        return questionAndAnswerRepository.save(questionAndAnswer);
    }

    @Override
    public List<QuestionAndAnswer> getAllQuestionsAndAnswers() {
        return (List<QuestionAndAnswer>) questionAndAnswerRepository.findAll();
    }

    @Override
    public List<QuestionAndAnswer> getUnansweredQuestion() {

        return questionAndAnswerRepository.findByStatus("unanswered");
    }

    @Override
    public List<QuestionAndAnswer> getAnsweredQuestion() {
        // TODO Auto-generated method stub
        return questionAndAnswerRepository.findByStatus("answered");
    }

}
