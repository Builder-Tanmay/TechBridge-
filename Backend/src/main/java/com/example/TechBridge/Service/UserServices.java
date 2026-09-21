package com.example.TechBridge.Service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.TechBridge.Entity.UserEntity;
import com.example.TechBridge.Repo.UserRepo;

import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServices {
	@Autowired
	public UserRepo ur;
	
	@Autowired
	private EmailService es;
	
	
	public List<UserEntity> viewalluser(){
		return ur.findAll();
	}
	
	public UserEntity getuserbyid(Long id) {
		Optional<UserEntity> data = ur.findById(id);
		if(data.isPresent())
		{
			return data.get();
		}
		else {
			return null ;
		}
	}
	
	public void adduser (UserEntity user)
	{
		if (ur.findByEmail(user.getEmail()) != null) {
	        throw new RuntimeException("An account with this email already exists!");
	    }
		ur.save(user);
		
		try {

	        String subject = "Welcome to TechBridge";
	        String message =
	                "Hi " + user.getFullname()+"," + "\n\nWelcome to TechBridge.\n"
	                + "Thank you for Registration , We are exicted to have you with Us.\n\n"
	                + "Warm regards\r\n"
	                + "TechBridge.com Team !!!";

	        es.sendemail(user.getEmail(), subject, message);

	        System.out.println("Mail sent"+user.getEmail());

	    } catch (Exception e) {

	       e.printStackTrace();

	    }
		
		
	}
	
	public UserEntity updateuserById(Long id ,UserEntity user) {
		Optional<UserEntity> data = ur.findById(id);
		if(data.isPresent())
		{
			UserEntity existinguser = data.get();
			if(user.getId()!= null)
				existinguser.setId(user.getId());
			if(user.getFullname()!=null)
				existinguser.setFullname(user.getFullname());
			if(user.getEmail()!=null)
				existinguser.setEmail(user.getEmail());
			if(user.getPassword()!=null)
				existinguser.setPassword(user.getPassword());
			if(user.getContact()!=null)
				existinguser.setContact(user.getContact());
			if(user.getGender()!=null)
				existinguser.setGender(user.getGender());
			if(user.getRole()!=null)
				existinguser.setRole(user.getRole());
			if(user.getActive()!=null)
				existinguser.setActive(user.getActive());
			
			return ur.save(existinguser);
			
		}
		return null;
	}
	
	// DELETE BY ID 
		public UserEntity deleteuserbyid(Long id) {
			Optional<UserEntity> data = ur.findById(id);
			if(data.isPresent())
			{
				ur.deleteById(id);
				return data.get();
			}
			else
			{
				return null;
			}
		}
		
		public Optional<UserEntity> getuserbyemailandpassword(String email, String password) {
			UserEntity user = ur.findByEmailAndPassword(email,password);
			if(user==null)
			{
				throw new RuntimeException("Invalid Email and Password");
			}
			return Optional.of(user);
		}
		
		
		// Stores OTP against userId in-memory: Key = userId, Value = 6-digit OTP
		private final Map<Long, String> otpStorage = new ConcurrentHashMap<>();
		
		// Stores Forgot Password OTP against email: Key = email, Value = 6-digit OTP
		private final Map<String, String> emailOtpStorage = new ConcurrentHashMap<>();
		private final SecureRandom secureRandom = new SecureRandom();
		
		// 1. Toggle user active / inactive status
		@Transactional
		public UserEntity toggleUserStatus(Long id) {
		    Optional<UserEntity> data = ur.findById(id);
		    if (data.isPresent()) {
		        UserEntity user = data.get();
		        // Toggle the boolean value safely
		        boolean currentStatus = Boolean.TRUE.equals(user.getActive());
		        user.setActive(!currentStatus);
		        
		        // Save and explicitly return the saved database entity
		        return ur.saveAndFlush(user);
		    }
		    return null;
		}

		// 2. Generate and email the delete OTP to the ADMIN email
		public boolean sendDeleteOtp(Long id) {
		    Optional<UserEntity> data = ur.findById(id);
		    if (data.isPresent()) {
		        UserEntity targetUser = data.get();
		        String otp = String.format("%06d", new Random().nextInt(999999));
		        otpStorage.put(id, otp);

		        // Target Admin Email
		        String adminEmail = "amtetanmay0011@gmail.com";

		        String subject = "Admin Action: Security Verification for Account Deletion";
		        String message = "Hi Admin,\n\n"
		                + "A request has been initiated to delete the following user account:\n"
		                + "• User ID: #" + targetUser.getId() + "\n"
		                + "• Name: " + targetUser.getFullname() + "\n"
		                + "• Email: " + targetUser.getEmail() + "\n\n"
		                + "Your OTP for authorizing this deletion is: " + otp + "\n\n"
		                + "Please do not share this OTP with anyone.\n\n"
		                + "Warm regards,\nTechBridge Security System";

		        try {
		            es.sendemail(adminEmail, subject, message);
		            return true;
		        } catch (Exception e) {
		            e.printStackTrace();
		        }
		    }
		    return false;
		}
		// 3. Verify the OTP and execute deletion
		public boolean verifyOtpAndDelete(Long id, String enteredOtp) {
		    String cachedOtp = otpStorage.get(id);
		    if (cachedOtp != null && cachedOtp.trim().equals(enteredOtp.trim())) {
		        otpStorage.remove(id);
		        ur.deleteById(id);
		        return true;
		    }
		    return false;
		}
		
		
		// 5. UPDATE USER PROFILE (Account Settings)
	    public UserEntity updateUserProfile(Long userId, UserEntity updatedData) {
	    	UserEntity existing = ur.findById(userId)
	                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

	        // Update fields if provided
	        if (updatedData.getFullname() != null && !updatedData.getFullname().trim().isEmpty()) {
	            existing.setFullname(updatedData.getFullname());
	        }
	        if (updatedData.getContact() != null) {
	            existing.setContact(updatedData.getContact());
	        }
	        if (updatedData.getGender() != null) {
	            existing.setGender(updatedData.getGender());
	        }
	        if (updatedData.getAddress() != null) {
	            existing.setAddress(updatedData.getAddress());
	        }
	        if (updatedData.getProfileImage() != null) {
	            existing.setProfileImage(updatedData.getProfileImage());
	        }
	        if (updatedData.getEmail() != null && !updatedData.getEmail().trim().isEmpty()) {
	            if (!existing.getEmail().equalsIgnoreCase(updatedData.getEmail())) {
	                if (ur.existsByEmail(updatedData.getEmail())) {
	                    throw new RuntimeException("Email is already in use by another account.");
	                }
	                existing.setEmail(updatedData.getEmail());
	            }
	        }

	        return ur.save(existing);
	    }

	    // 6. CHANGE PASSWORD (from Account Settings)
	    public boolean changePassword(Long userId, String oldPassword, String newPassword) {
	    	UserEntity user = ur.findById(userId)
	                .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));

	        if (!user.getPassword().equals(oldPassword)) {
	            throw new RuntimeException("Incorrect current password!");
	        }

	        user.setPassword(newPassword);
	        ur.save(user);
	        return true;
	    }

	    // 9. GENERATE & SEND OTP (Forgot Password)
	    public boolean sendOtp(String email) {
	        UserEntity user = ur.findByEmail(email);
	        if (user == null) {
	            return false;
	        }

	        String otp = String.format("%06d", secureRandom.nextInt(1_000_000));
	        emailOtpStorage.put(email, otp);

	        String subject = "TechBridge - Password Reset Verification OTP 🔑";
	        String message = "Hi " + (user.getFullname() != null ? user.getFullname() : "User") + ",\n\n"
	                + "Your OTP for resetting your TechBridge account password is: " + otp + "\n\n"
	                + "This OTP is valid for your password reset request. If you did not request this, please ignore this email.\n\n"
	                + "Regards,\nTechBridge Support Team";

	        es.sendemail(email, subject, message);
	        return true;
	    }

	    // 10. VALIDATE OTP
	    public boolean validateOtp(String email, String otp) {
	        String storedOtp = emailOtpStorage.get(email);
	        return storedOtp != null && storedOtp.equals(otp);
	    }

	    // 11. RESET PASSWORD WITH OTP
	    public boolean resetPassword(String email, String newPassword) {
	        UserEntity user = ur.findByEmail(email);
	        if (user == null) {
	            return false;
	        }

	        user.setPassword(newPassword);
	        ur.save(user);

	        emailOtpStorage.remove(email);
	        return true;
	    }
}
