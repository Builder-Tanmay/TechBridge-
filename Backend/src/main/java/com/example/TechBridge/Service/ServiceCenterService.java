package com.example.TechBridge.Service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.TechBridge.Entity.ServiceCenter;
import com.example.TechBridge.Repo.ServiceCenterRepository;

import java.util.List;

@Service
public class ServiceCenterService {

    @Autowired
    private ServiceCenterRepository repository;

    // Save / Add a center
    public ServiceCenter saveCenter(ServiceCenter center) {
        return repository.save(center);
    }

    // Get centers by area name (e.g. Ghatkopar)
    public List<ServiceCenter> getCentersByArea(String area) {
        return repository.findByAreaIgnoreCase(area);
    }

    // Get nearby centers by coordinates
    public List<ServiceCenter> getNearbyCenters(double lat, double lng, double radius) {
        return repository.findNearbyCenters(lat, lng, radius);
    }
}