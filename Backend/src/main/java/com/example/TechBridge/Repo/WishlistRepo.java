package com.example.TechBridge.Repo;

import com.example.TechBridge.Entity.WishlistEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Repository
public interface WishlistRepo extends JpaRepository<WishlistEntity, Long> {

    // Find all wishlist items for a specific user with eager product fetch
    @Query("SELECT w FROM WishlistEntity w LEFT JOIN FETCH w.product WHERE w.user.id = :userId")
    List<WishlistEntity> findByUserId(@Param("userId") Long userId);

    // Find specific wishlist record by user id and product id
    @Query("SELECT w FROM WishlistEntity w LEFT JOIN FETCH w.product WHERE w.user.id = :userId AND w.product.id = :productId")
    Optional<WishlistEntity> findByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    // Check if product exists in user's wishlist
    @Query("SELECT COUNT(w) > 0 FROM WishlistEntity w WHERE w.user.id = :userId AND w.product.id = :productId")
    boolean existsByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    // Delete a specific wishlist entry by user and product
    @Modifying
    @Transactional
    @Query("DELETE FROM WishlistEntity w WHERE w.user.id = :userId AND w.product.id = :productId")
    void deleteByUserIdAndProductId(@Param("userId") Long userId, @Param("productId") Long productId);

    // Clear entire wishlist for a user
    @Modifying
    @Transactional
    @Query("DELETE FROM WishlistEntity w WHERE w.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
