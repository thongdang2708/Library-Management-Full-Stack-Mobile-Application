package com.example.library.backend.repository;

import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import com.example.library.backend.entity.Book;
import com.example.library.backend.entity.Category;

@Repository
public interface BookWithPaginationRepository extends PagingAndSortingRepository<Book, Long> {

    @Query("Select b from Book b where concat(b.id, b.name, b.author) like %:keyword% ")
    Page<Book> searchBookWithKeyword(@Param("keyword") String keyword, PageRequest pageRequest);

   
}
