package com.example.library.backend.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CheckGradeValidator implements ConstraintValidator<CheckGrade, Double> {

    @Override
    public boolean isValid(Double value, ConstraintValidatorContext context) {

        return value >= 0 && value <= 5;
    }
}
