package com.example.TechBridge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
@EnableJpaAuditing
@SpringBootApplication
public class TechBridgeApplication {

	public static void main(String[] args) {
		SpringApplication.run(TechBridgeApplication.class, args);
	}

}
