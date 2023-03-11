package com.example.library.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.multipart.MultipartResolver;

import com.example.library.backend.entity.Role;
import com.example.library.backend.service.RoleService;

@SpringBootApplication
public class LibraryBackendApplication implements CommandLineRunner {

	@Autowired
	private RoleService roleService;

	public static void main(String[] args) {
		SpringApplication.run(LibraryBackendApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		Role[] roles = new Role[] {
				new Role("user"),
				new Role("admin")
		};

		for (Role role : roles) {
			roleService.saveRole(role);
		}
	}

	@Bean
	public BCryptPasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
