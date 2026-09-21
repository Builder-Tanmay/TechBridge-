package com.example.TechBridge.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.TechBridge.Entity.SupportTicketEntity;
import com.example.TechBridge.Entity.SupportTicketEntity.TicketStatus;
import com.example.TechBridge.Entity.UserEntity;
import com.example.TechBridge.Repo.SupportTicketRepo;
import com.example.TechBridge.Repo.UserRepo;

@Service
public class SupportTicketService {

    @Autowired
    private SupportTicketRepo ticketRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private EmailService emailService;

    public SupportTicketEntity createTicket(Long userId, SupportTicketEntity ticket) {
        Optional<UserEntity> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found with ID: " + userId);
        }

        ticket.setUser(userOpt.get());
        if (ticket.getStatus() == null) {
            ticket.setStatus(TicketStatus.OPEN);
        }
        return ticketRepo.save(ticket);
    }

    public List<SupportTicketEntity> getTicketsByUserId(Long userId) {
        return ticketRepo.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<SupportTicketEntity> getAllTickets() {
        return ticketRepo.findAllByOrderByCreatedAtDesc();
    }

    public SupportTicketEntity updateTicketStatus(Long ticketId, String statusStr) {
        Optional<SupportTicketEntity> opt = ticketRepo.findById(ticketId);
        if (opt.isEmpty()) {
            return null;
        }

        SupportTicketEntity ticket = opt.get();

        if (ticket.getStatus() == TicketStatus.CLOSED) {
            throw new IllegalStateException("Ticket is finalized/closed and cannot be modified.");
        }

        try {
            TicketStatus newStatus = TicketStatus.valueOf(statusStr.trim().toUpperCase());
            ticket.setStatus(newStatus);
            SupportTicketEntity savedTicket = ticketRepo.save(ticket);

            // Trigger Email to the Ticket Owner
            if (savedTicket.getUser() != null && savedTicket.getUser().getEmail() != null) {
                String userName = savedTicket.getUser().getFullname() != null ? 
                                  savedTicket.getUser().getFullname() : "Valued Customer";

                emailService.sendTicketStatusEmail(
                        savedTicket.getUser().getEmail(),
                        userName,
                        savedTicket.getId(),
                        savedTicket.getSubject(),
                        newStatus.name()
                );
            }

            return savedTicket;
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status value provided: " + statusStr);
        }
    }
}