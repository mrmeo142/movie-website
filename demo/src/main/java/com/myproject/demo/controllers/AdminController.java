package com.myproject.demo.controllers;

import com.myproject.demo.models.Admin;
import com.myproject.demo.services.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @GetMapping
    public ResponseEntity<List<Admin>> getAllActors() {
        return new ResponseEntity<>(adminService.findAllAdmins(), HttpStatus.OK);
    }

    // API đăng nhập
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody Admin admin) {
        Optional<Admin> existingAdmin = adminService.findByUsername(admin.getUsername());
        if (existingAdmin.isPresent() && existingAdmin.get().getPassword().equals(admin.getPassword())) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid username or password");
        }
    }

    // API thêm admin mới
    @PostMapping("/add")
    public ResponseEntity<?> addAdmin(@RequestBody Admin admin) {
        if (admin.getPassword() == null || admin.getPassword().length() < 6) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("Mật khẩu phải có ít nhất 6 ký tự");
        }
        Admin savedAdmin = adminService.saveAdmin(admin);
        return ResponseEntity.ok(savedAdmin);
    }


    @PutMapping("/put/{name}")
    public ResponseEntity<?> updateAdmin(@PathVariable String name, @RequestBody Admin admin) {
        Optional<Admin> editAdminOpt = adminService.findByUsername(name);
    
        if (editAdminOpt.isPresent()) {
            if (admin.getPassword() != null && admin.getPassword().length() < 6) {
                return ResponseEntity
                        .status(HttpStatus.BAD_REQUEST)
                        .body("Mật khẩu phải có ít nhất 6 ký tự");
            }
    
            Admin editAdmin = editAdminOpt.get();
            editAdmin.setUsername(admin.getUsername());
            editAdmin.setPassword(admin.getPassword());
    
            return new ResponseEntity<>(adminService.updateAdmin(editAdmin), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Admin not found", HttpStatus.NOT_FOUND);
        }
    }
    

    @DeleteMapping("/delete/{name}")
    public ResponseEntity<String> deleteAdmin(@PathVariable String name) {
        boolean deleted = adminService.deleteAdminByName(name);
        if (deleted) {
            return new ResponseEntity<>("Admin deleted successfully", HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Admin not found", HttpStatus.NOT_FOUND);
        }
    }
}