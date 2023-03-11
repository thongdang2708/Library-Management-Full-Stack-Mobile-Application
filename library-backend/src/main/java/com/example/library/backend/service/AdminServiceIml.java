package com.example.library.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.library.backend.entity.Admin;
import com.example.library.backend.exception.NotFoundWithException;
import com.example.library.backend.repository.AdminRepository;

@Service
public class AdminServiceIml implements AdminService {

    @Autowired
    private AdminRepository adminRepository;

    @Override
    public Admin getAdminWithId(Long id) {
        Optional<Admin> admin = adminRepository.findById(id);

        if (admin.isPresent()) {
            return admin.get();
        } else {
            throw new NotFoundWithException("This admin with this id " + id + " does not exist!");
        }
    }
}
