package com.example.library.backend.service;

import java.util.ArrayList;
import java.util.Arrays;

import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.data.web.SpringDataWebProperties.Pageable;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.util.StreamUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.library.backend.entity.Admin;
import com.example.library.backend.entity.Book;
import com.example.library.backend.entity.Category;
import com.example.library.backend.entity.User;
import com.example.library.backend.exception.NotFoundWithException;
import com.example.library.backend.exception.NotImplementedWithException;
import com.example.library.backend.message.BookResponse;
import com.example.library.backend.message.CheckResponse;
import com.example.library.backend.repository.BookJPARepository;
import com.example.library.backend.repository.BookRepository;
import com.example.library.backend.repository.BookWithPaginationRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class BookServiceIml implements BookService {

    private final Path storageFolder = Paths.get("uploads");

    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private BookWithPaginationRepository bookWithPaginationRepository;

    @Autowired
    private BookJPARepository bookJPARepository;

    @Autowired
    private BookRepository bookRepository;

    public boolean isImageFile(MultipartFile file) {

        String extensionName = FilenameUtils.getExtension(file.getOriginalFilename());
        System.out.println(extensionName);

        return Arrays.asList(new String[] { "png", "jpg", "jpeg", "bmp", "image" })
                .contains(extensionName.trim().toLowerCase());
    }

    @Override
    public String uploadFile(MultipartFile file) {

        try {

            if (file.isEmpty()) {
                throw new NotImplementedWithException("File is empty. Cannot upload file!");
            }

            System.out.println(file.getOriginalFilename());
            if (!isImageFile(file)) {
                throw new NotImplementedWithException(
                        file.getOriginalFilename() + "This is not image file. Cannot upload file!");
            }

            float fileSize = file.getSize() / 1_000_000.0f;

            if (fileSize > 20.0f) {
                throw new NotImplementedWithException("File must be <= 5Mb");
            }

            String fileExtensionName = FilenameUtils.getExtension(file.getOriginalFilename());
            String generatedFileName = UUID.randomUUID().toString().replace("-", "");
            generatedFileName = generatedFileName + "." + fileExtensionName;

            Path destinationFilePath = this.storageFolder.resolve(
                    Paths.get(generatedFileName)).normalize().toAbsolutePath();

            if (!destinationFilePath.getParent().equals(this.storageFolder.toAbsolutePath())) {
                throw new NotImplementedWithException("Cannot store file outside the current directory!");

            }

            Files.copy(file.getInputStream(), destinationFilePath, StandardCopyOption.REPLACE_EXISTING);

            return generatedFileName;

        } catch (IOException exception) {
            throw new NotImplementedWithException("Cannot upload file!");
        }

    }

    @Override
    public Book getSingleBook(Long id) {
        Optional<Book> book = bookRepository.findById(id);

        if (book.isPresent()) {
            return book.get();
        } else {
            throw new NotFoundWithException("This book with thid is " + id + " does not exist!");
        }
    }

    @Override
    public Book addBook(Book book, MultipartFile file, Long id) {

        String imageUrl = uploadFile(file);
        Admin admin = adminService.getAdminWithId(id);

        List<Book> allBooks = (List<Book>) bookRepository.findAll();

        boolean checkBookIsInclude = allBooks.stream().anyMatch(x -> x.getName().trim().equals(book.getName().trim()));

        if (checkBookIsInclude) {
            throw new NotImplementedWithException(
                    "This book with this name is already added! Please add another book name!");
        }

        Book newBook = new Book();

        newBook.setName(book.getName());
        newBook.setAuthor(book.getAuthor());
        newBook.setCategoryType(book.getCategoryType());
        newBook.setBorrowLength(book.getBorrowLength());
        newBook.setQuantity(book.getQuantity());
        newBook.setUrlImage(imageUrl);
        newBook.setCreatedAt(LocalDate.now());
        newBook.setAvailableQuantity(book.getQuantity());
        newBook.setAdmin(admin);

        return bookRepository.save(newBook);
    }

    @Override
    public List<String> getAllCategories() {
        Category category = new Category();

        return category.getAllCategories();
    }

    @Override
    public byte[] readImageFile(String fileName) {

        try {

            Path path = this.storageFolder.resolve(fileName);

            UrlResource resource = new UrlResource(path.toUri());

            if (resource.exists() || resource.isReadable()) {
                byte[] arrayBytes = StreamUtils.copyToByteArray(resource.getInputStream());
                return arrayBytes;
            } else {
                throw new NotImplementedWithException("Cannot read file!");
            }

        } catch (IOException ex) {
            throw new NotImplementedWithException("Cannot read file!");
        }
    }

    @Override
    public Book updateBook(MultipartFile file, Long id, Book book) {

        Book getSingleBook = getSingleBook(id);

        String imageFile = uploadFile(file);

        getSingleBook.setName(book.getName());
        getSingleBook.setAuthor(book.getAuthor());
        getSingleBook.setCategoryType(book.getCategoryType());
        getSingleBook.setBorrowLength(book.getBorrowLength());
        getSingleBook.setUrlImage(imageFile);
        getSingleBook.setQuantity(book.getQuantity());
        getSingleBook.setAvailableQuantity(book.getQuantity());

        return bookRepository.save(getSingleBook);

    }

    @Override
    public List<Book> getAllBooksWithPagination(int offset, int pageSize) {

        if (pageSize <= 0 || offset < 0) {
            throw new NotImplementedWithException("Cannot do pagination with invalid values!");
        }

        Page<Book> bookPage = bookWithPaginationRepository.findAll(PageRequest.of(offset, pageSize));

        List<Book> books = new ArrayList<>();

        for (Book book : bookPage) {
            books.add(book);
        }

        return books;
    }

    @Override
    public List<Book> getAllBooksWithCategory(String categoryName, int offset, int pageSize) {

        List<Book> convertToListBook = (List<Book>) bookRepository.findAll();

        Category category = new Category();

        List<Book> filteredBooks = convertToListBook.stream()
                .filter(x -> x.getCategoryType() == category.searchType(categoryName)).collect(Collectors.toList());

        return filteredBooks.stream().skip(offset * pageSize).limit(pageSize).collect(Collectors.toList());
    }

    @Override
    public Book increaseQuantity(Long id) {

        Book book = getSingleBook(id);

        book.setQuantity(book.getQuantity() + 1);
        book.setAvailableQuantity(book.getAvailableQuantity() + 1);

        return bookRepository.save(book);
    }

    @Override
    public Book decreaseQuantity(Long id) {
        Book book = getSingleBook(id);

        if (book.getQuantity() == 0 && book.getAvailableQuantity() > 0) {
            book.setQuantity(0);
            book.setAvailableQuantity(book.getQuantity() - 1);
            return bookRepository.save(book);
        } else if (book.getAvailableQuantity() == 0 && book.getQuantity() > 0) {
            book.setQuantity(book.getQuantity() - 1);
            book.setAvailableQuantity(0);
            return bookRepository.save(book);
        } else if (book.getAvailableQuantity() == 0 && book.getQuantity() == 0) {
            book.setQuantity(0);
            book.setAvailableQuantity(0);
            return bookRepository.save(book);
        }
        book.setQuantity(book.getQuantity() - 1);
        book.setAvailableQuantity(book.getAvailableQuantity() - 1);

        return bookRepository.save(book);
    }

    @Override
    public List<Book> searchBook(String keyword, int offset, int pageSize) {

        PageRequest paging = PageRequest.of(offset, pageSize);
        Page<Book> allBooks = bookWithPaginationRepository.searchBookWithKeyword(keyword, paging);

        List<Book> getBooks = new ArrayList<>();

        allBooks.stream().forEach(x -> {
            getBooks.add(x);
        });

        return getBooks;
    }

    @Override
    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    @Override
    public CheckResponse checkAvaibleQuantity(Long id) {

        Book book = getSingleBook(id);

        if (book.getAvailableQuantity() > 0) {
            return new CheckResponse(true);
        } else {
            return new CheckResponse(false);
        }
    }

    @Override
    public List<Book> getAllBooks() {
        return (List<Book>) bookRepository.findAll();
    }
}
