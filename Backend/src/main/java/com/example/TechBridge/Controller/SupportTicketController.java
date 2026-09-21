package com.example.TechBridge.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.TechBridge.Entity.SupportTicketEntity;
import com.example.TechBridge.Service.SupportTicketService;

@RestController
@RequestMapping("/api/tickets")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class SupportTicketController {

    @Autowired
    private SupportTicketService ticketService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SupportTicketEntity>> getUserTickets(@PathVariable Long userId) {
        List<SupportTicketEntity> tickets = ticketService.getTicketsByUserId(userId);
        return ResponseEntity.ok(tickets);
    }

    @PostMapping("/create/{userId}")
    public ResponseEntity<?> createTicket(
            @PathVariable Long userId,
            @RequestBody SupportTicketEntity ticket) {
        try {
            SupportTicketEntity created = ticketService.createTicket(userId, ticket);
            return ResponseEntity.status(HttpStatus.CREATED).body(created);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/admin/all")
    public ResponseEntity<List<SupportTicketEntity>> getAllTickets() {
        return ResponseEntity.ok(ticketService.getAllTickets());
    }

    // Handles PATCH cleanly and returns clear 400 messages
    @PatchMapping("/admin/update-status/{ticketId}")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long ticketId,
            @RequestParam(name = "status") String status) {
        try {
            SupportTicketEntity updated = ticketService.updateTicketStatus(ticketId, status);
            if (updated != null) {
                return ResponseEntity.ok(updated);
            }
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "Ticket not found with ID: " + ticketId));
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("message", e.getMessage()));
        }
    }
}