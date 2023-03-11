package com.example.library.backend.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.library.backend.entity.Role;
import com.example.library.backend.exception.NotFoundWithException;
import com.example.library.backend.exception.RoleNotFoundWithNameException;
import com.example.library.backend.repository.RoleRepository;

@Service
public class RoleServiceIml implements RoleService {

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void saveRole(Role role) {
        roleRepository.save(role);
    }

    @Override
    public Role getRoleByName(String roleName) {
        // TODO Auto-generated method stub
        Optional<Role> role = roleRepository.findByRole(roleName);

        if (role.isPresent()) {
            return role.get();
        } else {
            throw new NotFoundWithException("This role with " + roleName + " does not exist!");
        }

    }
}
