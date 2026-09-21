package com.example.TechBridge.Service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

	@Autowired
	private JavaMailSender mailsender;

	private static final String SENDER_EMAIL = "amtetanmay0011@gmail.com";

	@Async
	public void sendemail(String email, String subject, String message) {
		try {
			SimpleMailMessage mail = new SimpleMailMessage();
			mail.setFrom(SENDER_EMAIL);
			mail.setTo(email);
			mail.setSubject(subject);
			mail.setText(message);
			mailsender.send(mail);
			System.out.println("Email sent successfully to: " + email);
		} catch (Exception e) {
			System.out.println("Error sending email: " + e.getMessage());
		}
	}

	@Async
	public void sendTicketStatusEmail(String email, String userName, Long ticketId, String subject, String status) {
		try {
			String mailSubject = "TechBridge Ticket Update: #TCK-" + ticketId + " [" + status + "]";
			String message = "Hi " + (userName != null ? userName : "Customer") + ",\n\n"
					+ "Your support ticket status has been updated to: " + status + "\n\n"
					+ "Ticket ID: #TCK-" + ticketId + "\n"
					+ "Subject: " + subject + "\n\n"
					+ "Check updates on your dashboard: http://localhost:5173\n\n"
					+ "TechBridge Support Team";

			SimpleMailMessage mail = new SimpleMailMessage();
			mail.setFrom(SENDER_EMAIL);
			mail.setTo(email);
			mail.setSubject(mailSubject);
			mail.setText(message);
			mailsender.send(mail);
			System.out.println("Ticket status email sent to: " + email);
		} catch (Exception e) {
			System.out.println("Error sending ticket update email: " + e.getMessage());
		}
	}

	@Async
	public void sendServiceStatusEmail(String email, String userName, Long requestId, String deviceModel, String status) {
		try {
			String mailSubject = "TechBridge Service Update: #REQ-" + requestId + " [" + status + "]";
			String message = "Hi " + (userName != null ? userName : "Customer") + ",\n\n"
					+ "Your device service request status is now: " + status + "\n\n"
					+ "Request ID: #REQ-" + requestId + "\n"
					+ "Device: " + deviceModel + "\n\n"
					+ "Check updates on your dashboard: http://localhost:5173/dashboard\n\n"
					+ "TechBridge Service Center";

			SimpleMailMessage mail = new SimpleMailMessage();
			mail.setFrom(SENDER_EMAIL);
			mail.setTo(email);
			mail.setSubject(mailSubject);
			mail.setText(message);
			mailsender.send(mail);
			System.out.println("Service status email sent to: " + email);
		} catch (Exception e) {
			System.out.println("Error sending service update email: " + e.getMessage());
		}
	}
}