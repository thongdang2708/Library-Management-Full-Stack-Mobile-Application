package com.example.library.backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.apache.poi.ss.formula.eval.NotImplementedException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.library.backend.entity.Book;
import com.example.library.backend.entity.CheckoutBook;
import com.example.library.backend.entity.ConfirmationToken;
import com.example.library.backend.entity.Customer;
import com.example.library.backend.entity.QuestionAndAnswer;
import com.example.library.backend.entity.RegistrationInformation;
import com.example.library.backend.entity.Role;
import com.example.library.backend.entity.User;
import com.example.library.backend.exception.NotFoundWithException;
import com.example.library.backend.exception.UserExistsException;
import com.example.library.backend.message.CheckResponse;
import com.example.library.backend.message.UserResponse;
import com.example.library.backend.repository.BookRepository;
import com.example.library.backend.repository.CheckoutBookRepository;
import com.example.library.backend.repository.ConfirmationTokenRepository;
import com.example.library.backend.repository.CustomerRepository;
import com.example.library.backend.repository.QuestionAndAnswerRepository;
import com.example.library.backend.repository.UserRepository;

@Service
public class UserServiceIml implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private ConfirmationTokenRepository confirmationTokenRepository;

    @Autowired
    private CheckoutBookRepository checkoutBookRepository;

    @Autowired
    private QuestionAndAnswerRepository questionAndAnswerRepository;

    @Autowired
    private RoleService roleService;

    @Override
    public String registerUser(RegistrationInformation registrationInformation) {

        if (userRepository.existsUserByEmailAndChecks(registrationInformation.getEmail(), true)) {
            throw new UserExistsException("This user exists already and is already activated!");
        }

        User user = new User(registrationInformation.getEmail(), registrationInformation.getUsername(),
                registrationInformation.getPassword());

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role role = roleService.getRoleByName("user");
        user.addRoleToUser(role);

        User createdUser = userRepository.save(user);

        String token = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken(token, LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(15), createdUser);

        confirmationTokenRepository.save(confirmationToken);

        return token;
    }

    @Override
    public String registerUserAsAdmin(RegistrationInformation registrationInformation) {
        // TODO Auto-generated method stub
        if (userRepository.existsUserByEmailAndChecks(registrationInformation.getEmail(), true)) {
            throw new UserExistsException("This user exists already and is already activated!");
        }

        User user = new User(registrationInformation.getEmail(), registrationInformation.getUsername(),
                registrationInformation.getPassword());

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        Role role = roleService.getRoleByName("admin");
        user.addRoleToUser(role);

        User createdUser = userRepository.save(user);

        String token = UUID.randomUUID().toString();
        ConfirmationToken confirmationToken = new ConfirmationToken(token, LocalDateTime.now(),
                LocalDateTime.now().plusMinutes(15), createdUser);

        confirmationTokenRepository.save(confirmationToken);

        return token;
    }

    @Override
    public User getUserByEmail(String email) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            return user.get();
        } else {
            throw new NotFoundWithException("This user with this email " + email + " does not exist!");
        }
    }

    @Override
    public User getUserById(Long id) {
        Optional<User> user = userRepository.findById(id);

        if (user.isPresent()) {
            return user.get();
        } else {
            throw new NotFoundWithException("This user with this user id " + id + " does not exist!");
        }
    }

    @Override
    public void logout() {
        SecurityContextHolder.getContext().setAuthentication(null);
    }

    @Override
    public CheckResponse checkIsAdmin(Long id) {
        User user = getUserById(id);
        Role role = roleService.getRoleByName("admin");
        if (user.getRoles().contains(role)) {
            return new CheckResponse(true);
        }

        return new CheckResponse(false);
    }

    @Override
    public UserResponse getAdmin(Long id) {

        User user = getUserById(id);
        Role role = roleService.getRoleByName("admin");

        if (!user.getRoles().contains(role)) {
            throw new NotImplementedException("This user is not an admin");
        }

        return new UserResponse(user.getAdmin().getId(), user.getAdmin().getAddress(), user.getAdmin().getCity());
    }

    @Override
    public UserResponse getUser(Long id) {
        // TODO Auto-generated method stub

        User user = getUserById(id);
        Role role = roleService.getRoleByName("admin");

        if (user.getRoles().contains(role)) {
            throw new NotImplementedException("This user is not a customer but an admin!");
        }

        return new UserResponse(user.getCustomer().getId(), user.getCustomer().getCity(),
                user.getCustomer().getAddress());
    }

    @Override
    public List<Customer> getAllCustomers() {
        return (List<Customer>) customerRepository.findAll();
    }

    public Book getBook(Long bookId) {

        Optional<Book> book = bookRepository.findById(bookId);

        if (book.isPresent()) {
            return book.get();
        } else {
            throw new NotFoundWithException("This book " + bookId + " does not exist!");
        }
    }

    public Customer getCustomer(Long customerId) {

        Optional<Customer> customer = customerRepository.findById(customerId);

        if (customer.isPresent()) {
            return customer.get();
        } else {
            throw new NotFoundWithException("This customer with id " + customerId + " does not exist!");
        }
    }

    @Override
    public void deleteCustomers(Long customerId) {

        List<CheckoutBook> checkoutBooks = checkoutBookRepository.findByCustomerIdAndIsReturned(customerId, false);
        List<QuestionAndAnswer> questionAndAnswers = questionAndAnswerRepository.findByCustomerId(customerId);

        for (QuestionAndAnswer questionAndAnswer : questionAndAnswers) {
            questionAndAnswerRepository.deleteById(questionAndAnswer.getId());
        }
        ;

        Customer customer = getCustomer(customerId);

        for (CheckoutBook checkoutBook : checkoutBooks) {
            Book book = getBook(checkoutBook.getBook().getId());

            book.setAvailableQuantity(book.getAvailableQuantity() + 1);

            bookRepository.save(book);
        }
        ;

        List<ConfirmationToken> confirmationTokens = confirmationTokenRepository
                .findByUserId(customer.getUser().getId());

        for (ConfirmationToken confirmationToken : confirmationTokens) {
            confirmationTokenRepository.deleteById(confirmationToken.getId());
        }

        userRepository.deleteById(customer.getUser().getId());

    }
}
