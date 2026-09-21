package com.example.TechBridge.Controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.TechBridge.Entity.ServiceCenter;
import com.example.TechBridge.Service.ServiceCenterService;

import java.util.List;

@RestController
@RequestMapping("/api/service-centers")
@CrossOrigin(origins = "*")
public class ServiceCenterController {

    @Autowired
    private ServiceCenterService service;

    // 1. Add new service center: POST http://localhost:8080/api/service-centers
    @PostMapping
    public ServiceCenter addCenter(@RequestBody ServiceCenter center) {
        return service.saveCenter(center);
    }

    // 2. Fetch by area: GET http://localhost:8080/api/service-centers/area?name=Ghatkopar
    @GetMapping("/area")
    public List<ServiceCenter> getByArea(@RequestParam String name) {
        return service.getCentersByArea(name);
    }

    // 3. Fetch by location coordinates: GET http://localhost:8080/api/service-centers/nearby?lat=19.086&lng=72.908&radius=10
    @GetMapping("/nearby")
    public List<ServiceCenter> getNearby(
            @RequestParam double lat,
            @RequestParam double lng,
            @RequestParam(defaultValue = "10.0") double radius) {
        return service.getNearbyCenters(lat, lng, radius);
    }
}