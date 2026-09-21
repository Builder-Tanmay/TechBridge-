package com.example.TechBridge.Repo;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.TechBridge.Entity.ProductCategory;
import com.example.TechBridge.Entity.Products;

public interface ProductsRepo extends JpaRepository<Products, Long> {
    List<Products> findByCategory(ProductCategory category);
}