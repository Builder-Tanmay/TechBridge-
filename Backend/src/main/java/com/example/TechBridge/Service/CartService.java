package com.example.TechBridge.Service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.TechBridge.Entity.CartEntity;
import com.example.TechBridge.Entity.Products;
import com.example.TechBridge.Entity.UserEntity;
import com.example.TechBridge.Repo.CartRepo;
import com.example.TechBridge.Repo.ProductsRepo;
import com.example.TechBridge.Repo.UserRepo;

@Service
public class CartService {

    @Autowired
    public CartRepo cr;

    @Autowired
    public UserRepo ur;

    @Autowired
    public ProductsRepo pr;

    public List<CartEntity> viewallcartitems() {
        return cr.findAll();
    }

    public List<CartEntity> getcartbyuserid(Long userId) {
        return cr.findByUserId(userId);
    }

    @Transactional
    public CartEntity patchbyid(Long id, CartEntity cr2) {
        CartEntity existing = cr.findById(id)
                .orElseThrow(() -> new RuntimeException("Cart item not found with ID: " + id));

        // Locks minimum quantity to 1
        if (cr2.getQuantity() > 0) {
            existing.setQuantity(cr2.getQuantity());
        }
        if (cr2.getProduct() != null) {
            existing.setProduct(cr2.getProduct());
        }
        if (cr2.getUser() != null) {
            existing.setUser(cr2.getUser());
        }

        return cr.save(existing);
    }

    @Transactional
    public void deletecartbyid(Long id) {
        cr.deleteById(id);
    }

    @Transactional
    public void addtcartby(Long userid, Long productid, int quantity) {
        UserEntity user = ur.findById(userid)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userid));
        Products product = pr.findById(productid)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + productid));

        CartEntity existing = cr.findByUserAndProduct(user, product);

        if (existing != null) {
            int newQuantity = existing.getQuantity() + quantity;
            existing.setQuantity(Math.max(1, newQuantity));
            cr.save(existing);
        } else {
            CartEntity newitem = new CartEntity();
            newitem.setProduct(product);
            newitem.setUser(user);
            newitem.setQuantity(Math.max(1, quantity));
            cr.save(newitem);
        }
    }
}