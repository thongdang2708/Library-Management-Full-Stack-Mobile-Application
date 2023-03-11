package com.example.library.backend.repository;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.library.backend.entity.Book;

import jakarta.transaction.Transactional;

import java.util.List;

@Repository
public interface BookRepository extends CrudRepository<Book, Long> {

}
