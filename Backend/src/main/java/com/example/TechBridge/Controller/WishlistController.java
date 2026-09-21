package com.example.TechBridge.Controller;

import com.example.TechBridge.Entity.WishlistEntity;
import com.example.TechBridge.Service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    // 1. ADD TO WISHLIST
    // POST /api/wishlist/add?userId=1&productId=5 (or userid=1&productid=5)
    @PostMapping("/add")
    public ResponseEntity<?> addToWishlist(
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "userid", required = false) Long userid,
            @RequestParam(value = "productId", required = false) Long productId,
            @RequestParam(value = "productid", required = false) Long productid) {
        try {
            Long uId = userId != null ? userId : userid;
            Long pId = productId != null ? productId : productid;
            if (uId == null || pId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "userId and productId are required"));
            }
            WishlistEntity item = wishlistService.addToWishlist(uId, pId);
            return new ResponseEntity<>(item, HttpStatus.CREATED);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    // 2. TOGGLE WISHLIST ITEM
    // POST /api/wishlist/toggle?userId=1&productId=5 (or userid=1&productid=5)
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleWishlist(
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "userid", required = false) Long userid,
            @RequestParam(value = "productId", required = false) Long productId,
            @RequestParam(value = "productid", required = false) Long productid) {
        try {
            Long uId = userId != null ? userId : userid;
            Long pId = productId != null ? productId : productid;
            if (uId == null || pId == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "userId and productId are required"));
            }

            boolean exists = wishlistService.isItemInWishlist(uId, pId);
            Map<String, Object> response = new HashMap<>();
            if (exists) {
                wishlistService.removeFromWishlistByUserAndProduct(uId, pId);
                response.put("action", "removed");
                response.put("inWishlist", false);
                response.put("message", "Product removed from wishlist");
            } else {
                WishlistEntity added = wishlistService.addToWishlist(uId, pId);
                response.put("action", "added");
                response.put("inWishlist", true);
                response.put("item", added);
                response.put("message", "Product added to wishlist");
            }
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
        }
    }

    // 3. GET USER WISHLIST
    // GET /api/wishlist/user/1
    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserWishlist(@PathVariable("userId") Long userId) {
        try {
            List<WishlistEntity> list = wishlistService.getWishlistByUserId(userId);
            System.out.println("Fetched wishlist for userId " + userId + ": " + (list != null ? list.size() : 0) + " items");
            return ResponseEntity.ok(list);
        } catch (Exception e) {
            e.printStackTrace();
            Map<String, String> error = new HashMap<>();
            error.put("error", e.getMessage());
            return new ResponseEntity<>(error, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 4. CHECK IF ITEM IS IN WISHLIST
    // GET /api/wishlist/check?userId=1&productId=5 (or userid=1&productid=5)
    @GetMapping("/check")
    public ResponseEntity<Map<String, Boolean>> checkIfInWishlist(
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "userid", required = false) Long userid,
            @RequestParam(value = "productId", required = false) Long productId,
            @RequestParam(value = "productid", required = false) Long productid) {
        Long uId = userId != null ? userId : userid;
        Long pId = productId != null ? productId : productid;
        boolean inWishlist = (uId != null && pId != null) && wishlistService.isItemInWishlist(uId, pId);
        Map<String, Boolean> res = new HashMap<>();
        res.put("inWishlist", inWishlist);
        return ResponseEntity.ok(res);
    }

    // 5. REMOVE FROM WISHLIST BY RECORD ID
    // DELETE /api/wishlist/delete/10
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> removeFromWishlistById(@PathVariable("id") Long id) {
        boolean removed = wishlistService.removeFromWishlistById(id);
        Map<String, Object> res = new HashMap<>();
        res.put("success", removed);
        res.put("message", removed ? "Removed successfully" : "Wishlist item not found");
        return ResponseEntity.ok(res);
    }

    // 6. REMOVE FROM WISHLIST BY USER ID & PRODUCT ID
    // DELETE /api/wishlist/remove?userId=1&productId=5 (or userid=1&productid=5)
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeByUserAndProduct(
            @RequestParam(value = "userId", required = false) Long userId,
            @RequestParam(value = "userid", required = false) Long userid,
            @RequestParam(value = "productId", required = false) Long productId,
            @RequestParam(value = "productid", required = false) Long productid) {
        Long uId = userId != null ? userId : userid;
        Long pId = productId != null ? productId : productid;
        if (uId == null || pId == null) {
            return ResponseEntity.badRequest().body(Map.of("error", "userId and productId are required"));
        }
        boolean removed = wishlistService.removeFromWishlistByUserAndProduct(uId, pId);
        Map<String, Object> res = new HashMap<>();
        res.put("success", removed);
        res.put("message", removed ? "Removed successfully" : "Item not in wishlist");
        return ResponseEntity.ok(res);
    }

    // 7. CLEAR USER WISHLIST
    // DELETE /api/wishlist/clear/1
    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<?> clearUserWishlist(@PathVariable("userId") Long userId) {
        wishlistService.clearUserWishlist(userId);
        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("message", "Wishlist cleared successfully");
        return ResponseEntity.ok(res);
    }
}
