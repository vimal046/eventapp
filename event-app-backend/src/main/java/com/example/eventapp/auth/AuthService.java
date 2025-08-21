package com.example.eventapp.auth;

import java.util.Map;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.example.eventapp.auth.dto.AuthRequest;
import com.example.eventapp.auth.dto.AuthResponse;
import com.example.eventapp.auth.dto.RegisterRequest;
import com.example.eventapp.security.JwtService;
import com.example.eventapp.user.Role;
import com.example.eventapp.user.User;
import com.example.eventapp.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
	private final UserRepository userRepo;
	private final PasswordEncoder encoder;
	private final AuthenticationManager authManager;
	private final JwtService jwtService;

	public AuthResponse register(RegisterRequest req, boolean asAdmin) {
		if (userRepo.existsByEmail(req.getEmail())) {
			throw new RuntimeException("Email already registered");
		}

		User user = User.builder()
				.name(req.getName())
				.email(req.getEmail())
				.password(encoder.encode(req.getPassword()))
				.role(asAdmin ? Role.ADMIN : Role.USER)
				.build();

		userRepo.save(user);
		String token = jwtService.generateToken(user.getEmail(), Map.of("role",user.getRole()
				.name()));
		return new AuthResponse(token, user.getRole()
				.name(), user.getName());
	}

	public AuthResponse login(AuthRequest req) {
		authManager.authenticate(new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword()));
		User user = userRepo.findByEmail(req.getEmail())
				.orElseThrow();
		String token = jwtService.generateToken(user.getEmail(), Map.of("role", "ROLE_"+user.getRole()
				.name()));
		return new AuthResponse(token, user.getRole()
				.name(), user.getName());
	}
}
