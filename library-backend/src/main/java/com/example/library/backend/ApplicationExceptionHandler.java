package com.example.library.backend;

import org.springframework.data.crossstore.ChangeSetPersister.NotFoundException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.lang.Nullable;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import com.example.library.backend.exception.BadRequestWithException;
import com.example.library.backend.exception.NotFoundWithException;
import com.example.library.backend.exception.NotImplementedWithException;
import com.example.library.backend.exception.RoleNotFoundWithNameException;
import com.example.library.backend.exception.SendEmailException;
import com.example.library.backend.exception.UserExistsException;
import com.example.library.backend.validator.ErrorResponse;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@ControllerAdvice
public class ApplicationExceptionHandler extends ResponseEntityExceptionHandler {

    @Override
    @Nullable
    protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
            HttpHeaders headers, HttpStatusCode status, WebRequest request) {

        List<String> errors = new ArrayList<>();

        for (ObjectError error : ex.getBindingResult().getAllErrors()) {
            errors.add(error.getDefaultMessage());
        }

        return new ResponseEntity<>(new ErrorResponse(errors), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({ NotFoundWithException.class })
    public ResponseEntity<Object> handleNotFoundException(RuntimeException ex) {

        ErrorResponse errors = new ErrorResponse(Arrays.asList(ex.getLocalizedMessage()));

        return new ResponseEntity<>(errors, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler({ SendEmailException.class, NotImplementedWithException.class })
    public ResponseEntity<Object> handleNotImplemented(RuntimeException ex) {

        ErrorResponse errors = new ErrorResponse(Arrays.asList(ex.getLocalizedMessage()));

        return new ResponseEntity<>(errors, HttpStatus.NOT_IMPLEMENTED);
    }

    @ExceptionHandler({ BadRequestWithException.class })
    public ResponseEntity<Object> handleBadRequestException(RuntimeException ex) {
        ErrorResponse errors = new ErrorResponse(Arrays.asList(ex.getLocalizedMessage()));

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler({ UserExistsException.class })
    public ResponseEntity<Object> handleConflictException(RuntimeException ex) {
        ErrorResponse errors = new ErrorResponse(Arrays.asList(ex.getLocalizedMessage()));

        return new ResponseEntity<>(errors, HttpStatus.CONFLICT);

    }
}
