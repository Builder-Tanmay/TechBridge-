package com.example.TechBridge.Repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TechBridge.Entity.ServiceRequestEntity;
import com.example.TechBridge.Entity.ServiceRequestEntity.ServiceStatus;

@Repository
public interface ServiceRequestRepo extends JpaRepository<ServiceRequestEntity, Long> {
    List<ServiceRequestEntity> findByUserIdOrderByCreatedAtDesc(Long userId);
    int countByUserId(Long userId);
    int countByUserIdAndStatus(Long userId, ServiceStatus status);
}