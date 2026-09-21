package com.example.TechBridge.Controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.TechBridge.Entity.CartEntity;
import com.example.TechBridge.Service.CartService;

@RequestMapping("/api/cart")
@RestController
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    public CartService cs;

    @GetMapping("/getall")
    public List<CartEntity> viewallcartitems() {
        return cs.viewallcartitems();
    }

    @GetMapping("/cartitem/{userid}")
    public List<CartEntity> getusercart(@PathVariable Long userid) {
        return cs.getcartbyuserid(userid);
    }

    @PatchMapping("/patch/{id}")
    public CartEntity patchcartbyid(@PathVariable Long id, @RequestBody CartEntity cr) {
        return cs.patchbyid(id, cr);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deletecartbyid(@PathVariable Long id) {
        cs.deletecartbyid(id);
        return ResponseEntity.ok(Map.of("message", "Item removed from cart successfully"));
    }

    @PostMapping("/addtocart")
    public ResponseEntity<?> addtocart(
            @RequestParam Long userid,
            @RequestParam Long productid,
            @RequestParam(defaultValue = "1") int quantity) {
        cs.addtcartby(userid, productid, quantity);
        return ResponseEntity.ok(Map.of("message", "Hardware item added to cart successfully!"));
    }
}