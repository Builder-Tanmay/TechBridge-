package com.example.TechBridge.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.TechBridge.Entity.ServiceRequestEntity;
import com.example.TechBridge.Entity.ServiceRequestEntity.ServiceStatus;
import com.example.TechBridge.Entity.SupportTicketEntity;
import com.example.TechBridge.Entity.SupportTicketEntity.TicketStatus;
import com.example.TechBridge.Entity.UserEntity;
import com.example.TechBridge.Repo.ServiceRequestRepo;
import com.example.TechBridge.Repo.SupportTicketRepo;
import com.example.TechBridge.Repo.UserRepo;

@Service
public class DashboardServices {

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ServiceRequestRepo serviceRequestRepo;

    @Autowired
    private SupportTicketRepo supportTicketRepo;

    @Transactional(readOnly = true)
    public Map<String, Object> getUserDashboardSummary(Long userId) {
        Optional<UserEntity> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            return null;
        }
        UserEntity user = userOpt.get();

        int totalRequests = serviceRequestRepo.countByUserId(userId);
        int inProgressRequests = serviceRequestRepo.countByUserIdAndStatus(userId, ServiceStatus.IN_PROGRESS);
        int completedRequests = serviceRequestRepo.countByUserIdAndStatus(userId, ServiceStatus.COMPLETED);
        int activeTickets = supportTicketRepo.countByUserIdAndStatus(userId, TicketStatus.OPEN);

        List<ServiceRequestEntity> recentServices = serviceRequestRepo.findByUserIdOrderByCreatedAtDesc(userId);
        List<SupportTicketEntity> recentTickets = supportTicketRepo.findByUserIdOrderByCreatedAtDesc(userId);

        Map<String, Object> dashboard = new HashMap<>();
        dashboard.put("userId", user.getId());
        dashboard.put("userName", user.getFullname());
        dashboard.put("email", user.getEmail());
        dashboard.put("contact", user.getContact());
        dashboard.put("totalRequests", totalRequests);
        dashboard.put("inProgressRequests", inProgressRequests);
        dashboard.put("completedRequests", completedRequests);
        dashboard.put("activeTickets", activeTickets);
        dashboard.put("recentServices", recentServices);
        dashboard.put("recentTickets", recentTickets);

        return dashboard;
    }

    @Transactional
    public ServiceRequestEntity bookNewService(Long userId, ServiceRequestEntity request) {
        Optional<UserEntity> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            return null;
        }
        request.setUser(userOpt.get());
        if (request.getStatus() == null) {
            request.setStatus(ServiceStatus.PENDING);
        }
        return serviceRequestRepo.save(request);
    }

    @Transactional
    public SupportTicketEntity createSupportTicket(Long userId, SupportTicketEntity ticket) {
        Optional<UserEntity> userOpt = userRepo.findById(userId);
        if (userOpt.isEmpty()) {
            return null;
        }
        ticket.setUser(userOpt.get());
        if (ticket.getStatus() == null) {
            ticket.setStatus(TicketStatus.OPEN);
        }
        return supportTicketRepo.save(ticket);
    }
}