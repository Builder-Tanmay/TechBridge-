package com.example.TechBridge.Entity;
import java.time.Instant;
import java.util.List;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
@EntityListeners(AuditingEntityListener.class)
@Entity
public class UserEntity {
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	
	
	@Column(name = "fullname") // Maps Java fullName field to existing SQL 'fullname' column
	@JsonProperty("fullName") // Maps React JSON payload "fullName" to this field
	private String fullName;
	
	@NotBlank(message = "Email is required and cannot be empty")
	@Email(regexp = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$", message = "Please provide a valid email format (e.g., name@example.com)")
	@Column(unique = true, nullable = false)
	private String email;
	
	private String password;
	
	private String contact;
	
	@Enumerated(EnumType.STRING)
	private Gender gender; 
	
	private String address;
	
	@Column(name = "profile_image", length = 1500)
	private String profileImage;
	
	@Enumerated(EnumType.STRING)
	private Role role;
	
	private Boolean active = true;
	
	@CreatedDate
	private Instant createdAt;
	
	@LastModifiedDate
	private Instant lastModifiedAt;
	
	@OneToMany(mappedBy = "user",cascade = CascadeType.ALL) // cascade type allows all type of permitions EG- foreign key constran 
	private List <Products> products;

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getFullname() {
		return fullName;
	}

	public void setFullname(String fullname) {
		this.fullName = fullname;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getContact() {
		return contact;
	}

	public void setContact(String contact) {
		this.contact = contact;
	}

	public Gender getGender() {
		return gender;
	}

	public void setGender(Gender gender) {
		this.gender = gender;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}

	public Role getRole() {
		return role;
	}

	public void setRole(Role role) {
		this.role = role;
	}

	public Boolean getActive() {
		return active;
	}

	public void setActive(Boolean active) {
		this.active = active;
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(Instant createdAt) {
		this.createdAt = createdAt;
	}

	public Instant getLastModifiedAt() {
		return lastModifiedAt;
	}

	public void setLastModifiedAt(Instant lastModifiedAt) {
		this.lastModifiedAt = lastModifiedAt;
	}

	public String getProfileImage() {
		return profileImage;
	}

	public void setProfileImage(String profileImage) {
		this.profileImage = profileImage;
	}

	@Override
	public String toString() {
		return "UserEntity [id=" + id + ", fullname=" + fullName + ", email=" + email + ", password=" + password
				+ ", contact=" + contact + ", gender=" + gender + ", address=" + address + ", profileImage=" + profileImage + ", role=" + role
				+ ", active=" + active + ", createdAt=" + createdAt + ", lastModifiedAt=" + lastModifiedAt + "]";
	}

	
	
	

	

	
	
	
	
	
	
	
	
	
	
	

	
	
	
	
}
