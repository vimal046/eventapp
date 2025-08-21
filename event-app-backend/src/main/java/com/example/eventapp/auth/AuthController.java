package com.example.eventapp.auth;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventapp.auth.dto.AuthRequest;
import com.example.eventapp.auth.dto.AuthResponse;
import com.example.eventapp.auth.dto.RegisterRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
	private final AuthService authService;

	@PostMapping("/register")
	public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
		return ResponseEntity.ok(authService.register(req, false));
	}

	// For bootstrapping first ADMIN account without DB access. Remove/secure later.
	@PostMapping("/register-admin")
	public ResponseEntity<AuthResponse> registerAdmin(@Valid @RequestBody RegisterRequest req) {
		return ResponseEntity.ok(authService.register(req, true));
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest req) {
		return ResponseEntity.ok(authService.login(req));
	}

}
