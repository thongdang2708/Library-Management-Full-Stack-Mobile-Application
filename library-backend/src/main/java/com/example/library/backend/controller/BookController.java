package com.example.library.backend.controller;

import org.apache.catalina.connector.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.ObjectError;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

import com.example.library.backend.entity.Book;
import com.example.library.backend.entity.Category;
import com.example.library.backend.exception.BadRequestWithException;
import com.example.library.backend.exception.BindingResultException;
import com.example.library.backend.exception.NotImplementedWithException;
import com.example.library.backend.message.BookResponse;
import com.example.library.backend.service.BookService;
import java.util.ArrayList;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/v1/books")
public class BookController {

    @Autowired
    private BookService bookService;

    @PostMapping("/admin/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<Object> addBook(@RequestParam("file") MultipartFile file,
            @ModelAttribute("book") @Valid Book book, BindingResult bindingResult, @PathVariable Long id)
            throws MaxUploadSizeExceededException {

        if (bindingResult.hasErrors()) {

            List<String> errors = new ArrayList<>();

            for (ObjectError error : bindingResult.getAllErrors()) {
                errors.add(error.getDefaultMessage());
            }

            return new ResponseEntity<>(new BindingResultException(errors), HttpStatus.BAD_REQUEST);

        }

        Category category = new Category();

        book.setCategoryType(category.searchType(book.getCategory()));

        Book createdBook = bookService.addBook(book, file, id);
        System.out.println(file.getOriginalFilename());

        return new ResponseEntity<>(createdBook, HttpStatus.CREATED);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Object> getSingleBook(@PathVariable Long id) {

        return new ResponseEntity<>(bookService.getSingleBook(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<Object> updateBook(@PathVariable Long id,
            @ModelAttribute("book") @Valid Book book, BindingResult bindingResult,
            @RequestParam("file") MultipartFile file) {

        if (bindingResult.hasErrors()) {

            List<String> errors = new ArrayList<>();

            for (ObjectError error : bindingResult.getAllErrors()) {
                errors.add(error.getDefaultMessage());
            }

            return new ResponseEntity<>(new BindingResultException(errors), HttpStatus.BAD_REQUEST);

        }

        Category category = new Category();

        book.setCategoryType(category.searchType(book.getCategory()));

        return new ResponseEntity<>(bookService.updateBook(file, id, book), HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<HttpStatus> deleteBook(@PathVariable Long id) {

        return new ResponseEntity<>(HttpStatus.NO_CONTENT);
    }

    @GetMapping("/all/category")
    public ResponseEntity<List<String>> getAllCategories() {

        return new ResponseEntity<>(bookService.getAllCategories(), HttpStatus.OK);
    }

    @GetMapping("/search/{keyword}/offset/{offset}/pageSize/{pageSize}")
    public ResponseEntity<List<Book>> searchBook(@PathVariable String keyword, @PathVariable int offset,
            @PathVariable int pageSize) {

        return new ResponseEntity<>(bookService.searchBook(keyword, offset, pageSize), HttpStatus.OK);
    }

    @PutMapping("/{id}/increaseQuantity")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<Object> increaseQuantity(@PathVariable Long id) {

        return new ResponseEntity<>(bookService.increaseQuantity(id), HttpStatus.OK);
    }

    @PutMapping("/{id}/decreaseQuantity")
    @PreAuthorize("hasAuthority('admin')")
    public ResponseEntity<Object> decreaseQuantity(@PathVariable Long id) {

        return new ResponseEntity<>(bookService.decreaseQuantity(id), HttpStatus.OK);
    }

    @GetMapping("/pagination/{offset}/{pageSize}")
    public ResponseEntity<List<Book>> getBooksWithPagination(@PathVariable int offset, @PathVariable int pageSize) {

        return new ResponseEntity<>(bookService.getAllBooksWithPagination(offset, pageSize), HttpStatus.OK);
    }

    @GetMapping("/filter/category/{categoryName}/offset/{offset}/pageSize/{pageSize}")
    public ResponseEntity<List<Book>> getBooksWithCategoryName(@PathVariable String categoryName,
            @PathVariable int offset, @PathVariable int pageSize) {

        return new ResponseEntity<>(bookService.getAllBooksWithCategory(categoryName, offset, pageSize), HttpStatus.OK);
    }

    @GetMapping("/readFile/{fileName:.+}")
    public ResponseEntity<byte[]> readImageFile(@PathVariable String fileName) {

        try {

            byte[] arrayBytes = bookService.readImageFile(fileName);

            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(arrayBytes);

        } catch (RuntimeException ex) {
            return ResponseEntity.noContent().build();
        }
    }

    @GetMapping("/checkAvailableQuantity/{id}")
    public ResponseEntity<Object> checkAvailableQuantity(@PathVariable Long id) {

        return new ResponseEntity<>(bookService.checkAvaibleQuantity(id), HttpStatus.OK);
    }

    @GetMapping("/allBooks")
    public ResponseEntity<Object> getAllBooks() {

        return new ResponseEntity<>(bookService.getAllBooks(), HttpStatus.OK);
    }

}
