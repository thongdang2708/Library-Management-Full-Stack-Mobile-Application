package com.example.library.backend.message;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class BookResponse {

    private Long id;

    private String name;

    private String author;

    private String category;

    private Integer borrowLength;

    private String urlImage;

    private Integer quantity;

    private Integer availableQuantity;

    private LocalDateTime createdAt;

    private Long userId;
}
