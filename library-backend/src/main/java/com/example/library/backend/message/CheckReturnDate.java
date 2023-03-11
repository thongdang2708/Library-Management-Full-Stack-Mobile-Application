package com.example.library.backend.message;

import java.time.LocalDate;

import jakarta.validation.constraints.Null;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CheckReturnDate {

    private LocalDate timestamp;

    private Boolean condition;

    private Long dueLength;

    public CheckReturnDate(Boolean condition, Long dueLength) {
        this.timestamp = LocalDate.now();
        if (condition == false && dueLength < 0) {
            this.condition = condition;
            this.dueLength = dueLength;
        } else {
            this.condition = condition;
            this.dueLength = 1L;
        }
    }

}
