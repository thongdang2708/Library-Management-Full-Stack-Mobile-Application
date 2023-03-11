package com.example.library.backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.library.backend.entity.History;
import com.example.library.backend.service.HistoryService;
import java.util.List;

@RestController
@RequestMapping("/api/v1/history")
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    @PostMapping("/checkout/{checkoutId}/book/{bookId}/customer/{customerId}")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<Object> addHistory(@PathVariable Long checkoutId, @PathVariable Long bookId,
            @PathVariable Long customerId) {

        return new ResponseEntity<>(historyService.addHistory(checkoutId, bookId, customerId), HttpStatus.CREATED);
    }

    @GetMapping("/all/customer/{customerId}")
    @PreAuthorize("hasAuthority('user')")
    public ResponseEntity<List<History>> getAllHistoriesOfCustomers(@PathVariable Long customerId) {

        return new ResponseEntity<>(historyService.getAllHistoriesByCustomerId(customerId), HttpStatus.OK);
    }
}
