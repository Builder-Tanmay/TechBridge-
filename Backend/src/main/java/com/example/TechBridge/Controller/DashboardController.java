package com.example.TechBridge.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.TechBridge.Entity.ServiceRequestEntity;
import com.example.TechBridge.Entity.SupportTicketEntity;
import com.example.TechBridge.Repo.SupportTicketRepo;
import com.example.TechBridge.Service.DashboardServices;

@RestController
@RequestMapping("/api/user/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    @Autowired
    private DashboardServices dashboardServices;
    
    @Autowired
    private SupportTicketRepo supportTicketRepo;

    @GetMapping("/api/tickets/user/{userId}")
    public ResponseEntity<List<SupportTicketEntity>> getUserTickets(@PathVariable Long userId) {
        return ResponseEntity.ok(supportTicketRepo.findByUserIdOrderByCreatedAtDesc(userId));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getDashboard(@PathVariable Long userId) {
        Map<String, Object> data = dashboardServices.getUserDashboardSummary(userId);
        if (data != null) {
            return ResponseEntity.ok(data);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found with ID: " + userId));
    }

    @PostMapping("/{userId}/book-service")
    public ResponseEntity<?> bookService(
            @PathVariable Long userId,
            @RequestBody ServiceRequestEntity request) {
        ServiceRequestEntity created = dashboardServices.bookNewService(userId, request);
        if (created != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found with ID: " + userId));
    }

    @PostMapping("/{userId}/ticket")
    public ResponseEntity<?> createTicket(
            @PathVariable Long userId,
            @RequestBody SupportTicketEntity ticket) {
        SupportTicketEntity created = dashboardServices.createSupportTicket(userId, ticket);
        if (created != null) {
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "User not found with ID: " + userId));
    }
}