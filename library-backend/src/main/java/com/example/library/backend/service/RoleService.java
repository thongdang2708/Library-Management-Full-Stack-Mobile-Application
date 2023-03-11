package com.example.library.backend.service;

import com.example.library.backend.entity.Role;

public interface RoleService {

    void saveRole(Role role);

    Role getRoleByName(String roleName);
}
