package com.example.library.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.library.backend.entity.Book;
import java.util.List;

@Repository
public interface BookJPARepository extends JpaRepository<Book, Long> {

    @Modifying
    @Query("Select b from Book b where concat(b.id, b.name, b.author) like %:keyword%")
    List<Book> searchBookWithKeyword(@Param("keyword") String keyword);
}
