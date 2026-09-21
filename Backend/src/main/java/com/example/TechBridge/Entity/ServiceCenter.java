package com.example.TechBridge.Entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;

@Entity
@Table(name = "service_centers")
public class ServiceCenter {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Service center name is required")
    @Size(min = 2, max = 150, message = "Name must be between 2 and 150 characters")
    @Column(nullable = false)
    private String name;

    @NotNull(message = "Type is required (OFFICIAL or UNOFFICIAL)")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ServiceCenterType type; // Using the Enum here

    @NotBlank(message = "Contact number is required")
    @Pattern(regexp = "^(\\+91)?[6-9]\\d{9}$", message = "Must be a valid 10-digit mobile number")
    @Column(nullable = false)
    private String contactNumber;

    @NotBlank(message = "Address is required")
    @Column(nullable = false)
    private String address;

    @NotBlank(message = "Area is required")
    @Column(nullable = false)
    private String area;

    @NotBlank(message = "City is required")
    @Column(nullable = false)
    private String city;

    @NotNull(message = "Latitude is required")
    @DecimalMin(value = "-90.0", message = "Latitude must be between -90.0 and 90.0")
    @DecimalMax(value = "90.0", message = "Latitude must be between -90.0 and 90.0")
    @Column(nullable = false)
    private Double latitude;

    @NotNull(message = "Longitude is required")
    @DecimalMin(value = "-180.0", message = "Longitude must be between -180.0 and 180.0")
    @DecimalMax(value = "180.0", message = "Longitude must be between -180.0 and 180.0")
    @Column(nullable = false)
    private Double longitude;

    @Size(max = 500, message = "Details cannot exceed 500 characters")
    private String details;

    public ServiceCenter() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public ServiceCenterType getType() { return type; }
    public void setType(ServiceCenterType type) { this.type = type; }

    public String getContactNumber() { return contactNumber; }
    public void setContactNumber(String contactNumber) { this.contactNumber = contactNumber; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getArea() { return area; }
    public void setArea(String area) { this.area = area; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }

    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}