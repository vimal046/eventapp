package com.example.eventapp.security;

import java.security.Key;
import java.util.Date;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {
	private final Key key;
	private final long expirationMs;

	public JwtService(@Value("${app.jwt.secret}") String secret, @Value("${app.jwt.expirationMs}") long expirationMs) {
		this.key = Keys.hmacShaKeyFor(secret.getBytes());
		this.expirationMs = expirationMs;
	}

	public String generateToken(String username, Map<String, Object> claims) {
		Date now = new Date();
		Date exp = new Date(now.getTime() + expirationMs);
		return Jwts.builder()
				.setSubject(username)
				.addClaims(claims)
				.setIssuedAt(now)
				.setExpiration(exp)
				.signWith(key)
				.compact();
	}

	public String extractUsername(String token) {
		return parse(token).getBody()
				.getSubject();
	}

	private Jws<Claims> parse(String token) {
		return Jwts.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token);
	}

	public boolean isTokenValid(String token, String username) {
		try {
			return extractUsername(token).equals(username) && !isExpired(token);
		} catch (JwtException e) {
			return false;
		}
	}

	private boolean isExpired(String token) {
		return parse(token).getBody()
				.getExpiration()
				.before(new Date());
	}
}
