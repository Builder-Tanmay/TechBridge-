package com.example.TechBridge.Service;

import com.example.TechBridge.Entity.Products;
import com.example.TechBridge.Entity.UserEntity;
import com.example.TechBridge.Entity.WishlistEntity;
import com.example.TechBridge.Repo.ProductsRepo;
import com.example.TechBridge.Repo.UserRepo;
import com.example.TechBridge.Repo.WishlistRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class WishlistService {

    @Autowired
    private WishlistRepo wishlistRepo;

    @Autowired
    private UserRepo userRepo;

    @Autowired
    private ProductsRepo productsRepo;

    // 1. ADD ITEM TO WISHLIST
    public WishlistEntity addToWishlist(Long userId, Long productId) {
        // If already in wishlist, return existing item
        Optional<WishlistEntity> existing = wishlistRepo.findByUserIdAndProductId(userId, productId);
        if (existing.isPresent()) {
            return existing.get();
        }

        // Fetch User and Product reference
        UserEntity user = userRepo.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

        Products product = productsRepo.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        WishlistEntity wishlist = new WishlistEntity(user, product);
        return wishlistRepo.save(wishlist);
    }

    // 2. GET USER WISHLIST
    @Transactional(readOnly = true)
    public List<WishlistEntity> getWishlistByUserId(Long userId) {
        return wishlistRepo.findByUserId(userId);
    }

    // 3. CHECK IF ITEM IS IN WISHLIST
    @Transactional(readOnly = true)
    public boolean isItemInWishlist(Long userId, Long productId) {
        return wishlistRepo.existsByUserIdAndProductId(userId, productId);
    }

    // 4. REMOVE BY WISHLIST ID
    public boolean removeFromWishlistById(Long id) {
        if (wishlistRepo.existsById(id)) {
            wishlistRepo.deleteById(id);
            return true;
        }
        return false;
    }

    // 5. REMOVE BY USER ID & PRODUCT ID
    public boolean removeFromWishlistByUserAndProduct(Long userId, Long productId) {
        if (wishlistRepo.existsByUserIdAndProductId(userId, productId)) {
            wishlistRepo.deleteByUserIdAndProductId(userId, productId);
            return true;
        }
        return false;
    }

    // 6. CLEAR ENTIRE WISHLIST FOR USER
    public void clearUserWishlist(Long userId) {
        wishlistRepo.deleteByUserId(userId);
    }
}
