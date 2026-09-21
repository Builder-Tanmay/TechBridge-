package com.example.TechBridge.Repo;


import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.TechBridge.Entity.ServiceCenter;

import java.util.List;

@Repository
public interface ServiceCenterRepository extends JpaRepository<ServiceCenter, Long> {

    // Find all centers matching an area name (case-insensitive)
    List<ServiceCenter> findByAreaIgnoreCase(String area);

    // Find nearby centers using latitude & longitude (Haversine formula in KM)
    @Query(value = "SELECT *, " +
           "(6371 * acos(cos(radians(:lat)) * cos(radians(latitude)) * " +
           "cos(radians(longitude) - radians(:lng)) + " +
           "sin(radians(:lat)) * sin(radians(latitude)))) AS distance " +
           "FROM service_centers " +
           "HAVING distance <= :radius " +
           "ORDER BY distance ASC", nativeQuery = true)
    List<ServiceCenter> findNearbyCenters(
            @Param("lat") double lat,
            @Param("lng") double lng,
            @Param("radius") double radius
    );
}