package com.example.TechBridge.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.TechBridge.Entity.ProductCategory;
import com.example.TechBridge.Entity.Products;
import com.example.TechBridge.Service.ProductsService;

@RequestMapping("/api/parts")
@RestController
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ProductsController {
    
    @Autowired
    public ProductsService ps;

    
    @GetMapping("/getall")
    public List<Products> getAll(@RequestParam(required = false) ProductCategory category) {
        return ps.getAllProducts(category);
    }

    @GetMapping("/getby/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        Products product = ps.getProductById(id);
        return product != null ? ResponseEntity.ok(product) 
                               : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Part not found with id: " + id);
    }

    @PostMapping("/add")
    public ResponseEntity<?> addProduct(@RequestBody Products product) {
        Products saved = ps.addProduct(product);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PatchMapping("/update/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @RequestBody Products product) {
        Products updated = ps.updateProduct(id, product);
        return updated != null ? ResponseEntity.ok(updated) 
                               : ResponseEntity.status(HttpStatus.NOT_FOUND).body("Part not found with id: " + id);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        boolean deleted = ps.deleteProduct(id);
        return deleted ? ResponseEntity.ok(Map.of("message", "Part deleted successfully"))
                       : ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of("message", "Part not found with id: " + id));
    }
}