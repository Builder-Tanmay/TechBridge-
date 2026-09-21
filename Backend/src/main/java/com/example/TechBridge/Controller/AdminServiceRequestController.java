package com.example.TechBridge.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.TechBridge.Entity.ServiceRequestEntity;
import com.example.TechBridge.Entity.ServiceRequestEntity.ServiceStatus;
import com.example.TechBridge.Service.AdminServiceRequestService;

@RestController
@RequestMapping("/api/admin/services")
@CrossOrigin(origins = "*")
public class AdminServiceRequestController {

    @Autowired
    private AdminServiceRequestService adminService;

    // GET all service requests across all users
    @GetMapping("/all")
    public ResponseEntity<List<ServiceRequestEntity>> getAllServices() {
        return ResponseEntity.ok(adminService.getAllServiceRequests());
    }

    // PATCH update service status (PENDING, IN_PROGRESS, COMPLETED, CANCELLED)
    @PatchMapping("/update-status/{requestId}")
    public ResponseEntity<?> updateServiceStatus(
            @PathVariable Long requestId,
            @RequestParam ServiceStatus status) {
        ServiceRequestEntity updated = adminService.updateStatus(requestId, status);
        if (updated != null) {
            return ResponseEntity.ok(updated);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "Service request not found with ID: " + requestId));
    }
}