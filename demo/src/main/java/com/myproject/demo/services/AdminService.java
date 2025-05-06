package com.myproject.demo.services;

import com.myproject.demo.models.Admin;
import com.myproject.demo.repositories.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AdminService {

    @Autowired
    private AdminRepository adminRepository;

    public List<Admin> findAllAdmins() {
        return adminRepository.findAll();
    }

    public Optional<Admin> findByUsername(String username) {
        return adminRepository.findByUsername(username);
    }

    public Admin updateAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public Admin createAdmin(Admin admin) {
        return adminRepository.save(admin);
    }

    public boolean deleteAdminByName(String name) {
        Optional<Admin> actor = adminRepository.findByUsername(name);
        if (actor.isPresent()) {
            adminRepository.delete(actor.get());
            return true;
        } else {
            return false;
        }
    }

    public Admin saveAdmin(Admin admin) {
        return adminRepository.save(admin);
    }
}