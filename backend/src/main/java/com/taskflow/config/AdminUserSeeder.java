package com.taskflow.config;

import com.taskflow.model.User;
import com.taskflow.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.findByEmail("admin@taskflow.com").isPresent()) {
            return;
        }

        User admin = new User();
        admin.setName("Admin");
        admin.setEmail("admin@taskflow.com");
        admin.setPassword(passwordEncoder.encode("Admin@123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);
    }
}
