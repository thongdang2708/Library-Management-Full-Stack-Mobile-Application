package com.example.library.backend.message;

import com.example.library.backend.entity.Review;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ReviewResponse {

    private Review review;

    private UserForReview userForReview;
}
