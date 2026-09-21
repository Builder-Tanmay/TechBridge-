package com.example.TechBridge.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.TechBridge.Entity.ServiceRequestEntity;
import com.example.TechBridge.Entity.ServiceRequestEntity.ServiceStatus;
import com.example.TechBridge.Repo.ServiceRequestRepo;

@Service
public class AdminServiceRequestService {

    @Autowired
    private ServiceRequestRepo serviceRequestRepo;

    @Autowired
    private EmailService emailService;

    public List<ServiceRequestEntity> getAllServiceRequests() {
        return serviceRequestRepo.findAll();
    }

    @Transactional
    public ServiceRequestEntity updateStatus(Long requestId, ServiceStatus status) {
        Optional<ServiceRequestEntity> optionalRequest = serviceRequestRepo.findById(requestId);
        if (optionalRequest.isPresent()) {
            ServiceRequestEntity request = optionalRequest.get();
            request.setStatus(status);
            ServiceRequestEntity saved = serviceRequestRepo.save(request);

            // Trigger Email to the Service Request Owner
            if (saved.getUser() != null && saved.getUser().getEmail() != null) {
                String userName = saved.getUser().getFullname() != null ? 
                                  saved.getUser().getFullname() : "Valued Customer";

                emailService.sendServiceStatusEmail(
                        saved.getUser().getEmail(),
                        userName,
                        saved.getId(),
                        saved.getDeviceModel(),
                        status.name()
                );
            }

            return saved;
        }
        return null;
    }
}