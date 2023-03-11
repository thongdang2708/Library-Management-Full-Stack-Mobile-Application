package com.example.library.backend.message;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CheckResponse {

    private LocalDate timestamp;

    private Boolean condition;

    public CheckResponse(Boolean condition) {
        this.timestamp = LocalDate.now();
        this.condition = condition;
    }
}
