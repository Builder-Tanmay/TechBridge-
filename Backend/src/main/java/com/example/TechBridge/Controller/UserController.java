package com.example.TechBridge.Controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.TechBridge.Entity.UserEntity;
import com.example.TechBridge.Service.UserServices;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/user")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class UserController {

    @Autowired
    public UserServices us;

    // 1. GET all users
    @GetMapping("/getall")
    public ResponseEntity<List<UserEntity>> viewalluser() {
        return ResponseEntity.ok(us.viewalluser());
    }

    // 2. GET user by ID
    @GetMapping("/getby/{id}")
    public ResponseEntity<?> getuserbyid(@PathVariable Long id) {
        UserEntity data = us.getuserbyid(id);
        if (data != null) {
            return ResponseEntity.ok(data);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User Not Found With ID: " + id));
    }

    // 3. POST register user
    @PostMapping("/add")
    public ResponseEntity<?> adduser(@Valid @RequestBody UserEntity user) {
        try {
            us.adduser(user);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "User Registered Successfully!"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    // 4. PATCH update user details
    @PatchMapping("/update/{id}")
    public ResponseEntity<?> updateuser(@PathVariable Long id, @RequestBody UserEntity user) {
        UserEntity updateduser = us.updateuserById(id, user);
        if (updateduser != null) {
            return ResponseEntity.ok(updateduser);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User update failed. User not found with ID: " + id));
    }

    // 5. DELETE user by ID
    @DeleteMapping("/deletebyid/{id}")
    public ResponseEntity<?> deleteuserbyid(@PathVariable Long id) {
        UserEntity data = us.deleteuserbyid(id);
        if (data != null) {
            return ResponseEntity.ok(Map.of("message", "User deleted successfully!"));
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User Not Found With ID: " + id));
    }

    // 6. POST login verification
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestParam String email, @RequestParam String password) {
        try {
            Optional<UserEntity> data = us.getuserbyemailandpassword(email, password);
            if (data.isEmpty()) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid Email or Password"));
            }
            return ResponseEntity.ok(data.get());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid Email or Password"));
        }
    }

    // 7. PATCH toggle user active / inactive status
    @PatchMapping("/toggle-status/{id}")
    public ResponseEntity<?> toggleStatus(@PathVariable Long id) {
        UserEntity updated = us.toggleUserStatus(id);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found with ID: " + id));
    }

    // 8. POST send deletion OTP
    @PostMapping("/send-delete-otp/{id}")
    public ResponseEntity<?> sendDeleteOtp(@PathVariable Long id) {
        boolean isSent = us.sendDeleteOtp(id);
        if (isSent) {
            return ResponseEntity.ok(Map.of("message", "OTP sent successfully to registered email."));
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("message", "Failed to send OTP or user not found."));
    }

    // 9. POST verify OTP and delete
    @PostMapping("/verify-delete-otp/{id}")
    public ResponseEntity<?> verifyDeleteOtp(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String otp = body.get("otp");
        if (otp == null || otp.isBlank()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", "OTP parameter is required."));
        }
        boolean isDeleted = us.verifyOtpAndDelete(id, otp);
        if (isDeleted) {
            return ResponseEntity.ok(Map.of("message", "User deleted successfully."));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid or expired OTP."));
    }
    
    // 5. UPDATE USER PROFILE INFORMATION (Account Settings)
    // PUT http://localhost:8080/api/user/update/1
    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUserProfile(
            @PathVariable("id") Long id,
            @RequestBody UserEntity updatedData) {
        try {
            UserEntity updatedUser = us.updateUserProfile(id, updatedData);
            return ResponseEntity.ok(updatedUser);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    // 6. CHANGE PASSWORD (from Account Settings)
    // PUT http://localhost:8080/api/user/change-password/1?oldPassword=...&newPassword=...
    @PutMapping("/change-password/{id}")
    public ResponseEntity<?> changePassword(
            @PathVariable("id") Long id,
            @RequestParam("oldPassword") String oldPassword,
            @RequestParam("newPassword") String newPassword) {
        try {
            us.changePassword(id, oldPassword, newPassword);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Password changed successfully!");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    // 7. SEND OTP (Forgot Password)
    // POST http://localhost:8080/api/user/send-otp?email=...
    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestParam("email") String email) {
        boolean sent = us.sendOtp(email);
        if (sent) {
            return ResponseEntity.ok("OTP sent successfully to " + email);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Email address not found!");
        }
    }

    // 8. VALIDATE OTP (Forgot Password)
    // POST http://localhost:8080/api/user/validate-otp?email=...&otp=...
    @PostMapping("/validate-otp")
    public ResponseEntity<?> validateOtp(
            @RequestParam("email") String email,
            @RequestParam("otp") String otp) {
        boolean isValid = us.validateOtp(email, otp);
        if (isValid) {
            return ResponseEntity.ok("OTP validated successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid or expired OTP!");
        }
    }

    // 9. RESET PASSWORD (Forgot Password)
    // POST http://localhost:8080/api/user/reset-password?email=...&newPassword=...
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(
            @RequestParam("email") String email,
            @RequestParam("newPassword") String newPassword) {
        boolean reset = us.resetPassword(email, newPassword);
        if (reset) {
            return ResponseEntity.ok("Password reset successfully!");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to reset password.");
        }
    }

}