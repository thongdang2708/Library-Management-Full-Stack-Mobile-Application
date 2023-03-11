package com.example.library.backend.service;

import org.springframework.web.multipart.MultipartFile;

import com.example.library.backend.entity.Book;
import com.example.library.backend.message.CheckResponse;

import java.util.List;

public interface BookService {

    String uploadFile(MultipartFile file);

    Book addBook(Book book, MultipartFile file, Long id);

    List<String> getAllCategories();

    byte[] readImageFile(String fileName);

    Book getSingleBook(Long id);

    Book updateBook(MultipartFile file, Long id, Book book);

    void deleteBook(Long id);

    List<Book> getAllBooksWithPagination(int offset, int pageSize);

    List<Book> getAllBooksWithCategory(String categoryName, int offset, int pageSize);

    Book increaseQuantity(Long id);

    Book decreaseQuantity(Long id);

    List<Book> searchBook(String keyword, int offset, int pageSize);

    CheckResponse checkAvaibleQuantity(Long id);

    List<Book> getAllBooks();

}
