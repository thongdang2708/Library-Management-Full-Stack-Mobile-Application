package com.example.library.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.library.backend.entity.User;

import jakarta.transaction.Transactional;

@Repository
public interface UserRepository extends CrudRepository<User, Long> {

    boolean existsUserByEmailAndChecks(String email, boolean checks);

    @Transactional
    @Modifying
    @Query("Update User u set u.checks=true where u.email=:email")
    int updateChecksWithEmail(@Param("email") String email);

    Optional<User> findByEmail(String email);

}
