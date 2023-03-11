package com.example.library.backend.exception;

import java.time.LocalDate;
import java.util.List;

import org.springframework.cglib.core.Local;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BindingResultException {

    private LocalDate timestamp;

    private List<String> messages;

    public BindingResultException(List<String> messages) {
        this.timestamp = LocalDate.now();
        this.messages = messages;
    }

}
