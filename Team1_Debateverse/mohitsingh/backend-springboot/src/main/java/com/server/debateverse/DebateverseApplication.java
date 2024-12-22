package com.server.debateverse;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.server.debateverse.entities.User;
import com.server.debateverse.repositories.UserRepo;

import lombok.RequiredArgsConstructor;

@SpringBootApplication
@RequiredArgsConstructor
public class DebateverseApplication implements CommandLineRunner {

	private final UserRepo userRepo;

	private final PasswordEncoder passwordEncoder;

	private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(DebateverseApplication.class);

	public static void main(String[] args) {
		SpringApplication.run(DebateverseApplication.class, args);
	}

	@Override
	public void run(String... args) {
		if (!userRepo.findByEmail("admin@gmail.com").isPresent()) {
			User admin = new User();
			admin.setName("admin");
			admin.setEmail("admin@gmail.com");
			admin.setPassword(passwordEncoder.encode("admin"));
			admin.setRole(User.Role.ADMIN);
			admin.setEnabled(true);
			userRepo.save(admin);
			log.info("Admin user created successfully!");
		} else {
			log.info("Admin user already exists. Skipping creation.");
		}
	}

}
