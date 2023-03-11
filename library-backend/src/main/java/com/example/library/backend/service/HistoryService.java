package com.example.library.backend.service;

import com.example.library.backend.entity.History;
import java.util.List;

public interface HistoryService {
    History addHistory(Long id, Long bookId, Long customerId);

    List<History> getAllHistoriesByCustomerId(Long customerId);
}
