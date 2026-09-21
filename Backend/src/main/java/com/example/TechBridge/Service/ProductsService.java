package com.example.TechBridge.Service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.TechBridge.Entity.ProductCategory;
import com.example.TechBridge.Entity.Products;
import com.example.TechBridge.Repo.ProductsRepo;

@Service
public class ProductsService {
    
    @Autowired
    public ProductsRepo pr;
    
    public List<Products> getAllProducts(ProductCategory category) {
        if (category != null) {
            return pr.findByCategory(category);
        }
        return pr.findAll();
    }
    
    public Products getProductById(Long id) {
        return pr.findById(id).orElse(null);
    }
    
    public Products addProduct(Products product) {
        return pr.save(product);
    }
    
    @Transactional
    public Products updateProduct(Long id, Products updated) {
        Optional<Products> existing = pr.findById(id);
        if (existing.isPresent()) {
            Products part = existing.get();
            if (updated.getPartName() != null) 
                part.setPartName(updated.getPartName());
            if (updated.getPartDesc() != null) 
                part.setPartDesc(updated.getPartDesc());
            if (updated.getBrand() != null) 
                part.setBrand(updated.getBrand());
            if (updated.getModelName() != null) 
                part.setModelName(updated.getModelName());
            if (updated.getStockQuantity() != null) 
                part.setStockQuantity(updated.getStockQuantity());
            if (updated.getPrice() != null) 
                part.setPrice(updated.getPrice());
            if (updated.getImg() != null) 
                part.setImg(updated.getImg());
            if (updated.getCategory() != null) 
                part.setCategory(updated.getCategory());
            return pr.saveAndFlush(part);
        }
        return null;
    }
    
    @Transactional
    public boolean deleteProduct(Long id) {
        if (pr.existsById(id)) {
            pr.deleteById(id);
            return true;
        }
        return false;
    }
}