package com.example.TechBridge.Repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.TechBridge.Entity.UserEntity;

@Repository
public interface UserRepo extends JpaRepository<UserEntity, Long> {

	UserEntity findByEmailAndPassword(String email, String password);

	UserEntity findByEmail(String email);
	
	// Check if email already exists
    boolean existsByEmail(String email);

}
