package com.example.TechBridge.Entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "products")
public class Products {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "part_name")
    private String partName;
    
    @Column(name = "part_desc", length = 1000)
    private String partDesc;
    
    @Column(name = "brand")
    private String brand;
    
    @Column(name = "model_name")
    private String modelName;
    
    @Column(name = "stock_quantity")
    private Integer stockQuantity = 0;
    
    @Column(name = "price")
    private Double price = 0.0;
    
    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String img;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", length = 50)
    private ProductCategory category = ProductCategory.SPARE_PART;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonIgnoreProperties("products")
    private UserEntity user;

    public Products() {}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getPartName() {
		return partName;
	}

	public void setPartName(String partName) {
		this.partName = partName;
	}

	public String getPartDesc() {
		return partDesc;
	}

	public void setPartDesc(String partDesc) {
		this.partDesc = partDesc;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}

	public String getModelName() {
		return modelName;
	}

	public void setModelName(String modelName) {
		this.modelName = modelName;
	}

	public Integer getStockQuantity() {
		return stockQuantity;
	}

	public void setStockQuantity(Integer stockQuantity) {
		this.stockQuantity = stockQuantity;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public String getImg() {
		return img;
	}

	public void setImg(String img) {
		this.img = img;
	}

	public ProductCategory getCategory() {
		return category;
	}

	public void setCategory(ProductCategory category) {
		this.category = category;
	}

	public UserEntity getUser() {
		return user;
	}

	public void setUser(UserEntity user) {
		this.user = user;
	}

	@Override
	public String toString() {
		return "Products [id=" + id + ", partName=" + partName + ", partDesc=" + partDesc + ", brand=" + brand
				+ ", modelName=" + modelName + ", stockQuantity=" + stockQuantity + ", price=" + price + ", img=" + img
				+ ", category=" + category + ", user=" + user + "]";
	}
    
    

   
}