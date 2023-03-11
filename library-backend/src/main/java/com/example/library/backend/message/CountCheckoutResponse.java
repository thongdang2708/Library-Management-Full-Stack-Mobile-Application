package com.example.library.backend.message;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class CountCheckoutResponse {

    private Long customerId;

    private Integer numberOfCheckouts;

    private Integer maxCheckouts;
}
