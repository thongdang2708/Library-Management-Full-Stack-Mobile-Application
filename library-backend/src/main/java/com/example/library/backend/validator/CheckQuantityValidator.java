package com.example.library.backend.validator;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class CheckQuantityValidator implements ConstraintValidator<CheckQuantity, Integer> {
    @Override
    public boolean isValid(Integer value, ConstraintValidatorContext context) {

        return value >= 0;
    }
}
