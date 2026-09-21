package com.example.TechBridge.Repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TechBridge.Entity.SupportTicketEntity;
import com.example.TechBridge.Entity.SupportTicketEntity.TicketStatus;

@Repository
public interface SupportTicketRepo extends JpaRepository<SupportTicketEntity, Long> {

    List<SupportTicketEntity> findByUserIdOrderByCreatedAtDesc(Long userId);

    List<SupportTicketEntity> findAllByOrderByCreatedAtDesc();

    int countByUserIdAndStatus(Long userId, TicketStatus status);
}