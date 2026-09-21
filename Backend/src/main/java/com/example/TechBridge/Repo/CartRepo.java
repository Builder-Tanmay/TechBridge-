package com.example.TechBridge.Repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TechBridge.Entity.CartEntity;
import com.example.TechBridge.Entity.Products;
import com.example.TechBridge.Entity.UserEntity;

@Repository
public interface CartRepo extends JpaRepository<CartEntity, Long> {

    List<CartEntity> findByUserId(Long id);

    CartEntity findByUserAndProduct(UserEntity user, Products product);
}