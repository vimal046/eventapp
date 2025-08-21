package com.example.eventapp.booking;

import java.util.List;

import org.apache.coyote.BadRequestException;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.eventapp.booking.dto.BookingResponse;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
public class BookingController {
	private final BookingService service;

	@PreAuthorize("hasRole('USER')")
	@PostMapping("/events/{eventId}")
	public ResponseEntity<Booking> book(@PathVariable Long eventId, @RequestParam int quantity, Authentication auth)
			throws BadRequestException {
		return ResponseEntity.ok(service.book(eventId, quantity, auth));
	}

	@PreAuthorize("hasRole('USER')")
	@GetMapping
	public ResponseEntity<List<BookingResponse>> getMyBookings(Authentication auth) {
		return ResponseEntity.ok(service.getBookingsForUser(auth));

	}
}
