package com.example.library.backend.entity;

import java.util.ArrayList;
import java.util.List;

public class Category {

    enum CategoryType {
        Front_End,
        Back_End,
        Data,
        DevOps
    }

    CategoryType frontEnd = CategoryType.Front_End;
    CategoryType backEnd = CategoryType.Back_End;
    CategoryType data = CategoryType.Data;
    CategoryType devOps = CategoryType.DevOps;

    public CategoryType getFrontEnd() {
        return frontEnd;
    }

    public CategoryType getBackend() {
        return backEnd;
    }

    public CategoryType getData() {
        return data;
    }

    public CategoryType getDevops() {
        return devOps;
    }

    public CategoryType searchType(String value) {

        for (CategoryType category : CategoryType.values()) {
            if (category.toString().equals(value)) {
                return category;
            }
        }

        return null;
    }

    public List<String> getAllCategories() {

        List<String> categories = new ArrayList<>();

        for (CategoryType category : CategoryType.values()) {
            categories.add(category.toString());
        }

        return categories;
    }

}
