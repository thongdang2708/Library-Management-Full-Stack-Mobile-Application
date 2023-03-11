package com.example.library.backend.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.example.library.backend.entity.Admin;

@Repository
public interface AdminRepository extends CrudRepository<Admin, Long> {

}
