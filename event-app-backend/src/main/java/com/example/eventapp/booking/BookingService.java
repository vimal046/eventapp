package com.example.eventapp.booking;

import java.util.List;

import org.apache.coyote.BadRequestException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.example.eventapp.booking.dto.BookingResponse;
import com.example.eventapp.booking.dto.EventDto;
import com.example.eventapp.common.NotFoundException;
import com.example.eventapp.event.Event;
import com.example.eventapp.event.EventRepository;
import com.example.eventapp.user.User;
import com.example.eventapp.user.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class BookingService {
	private final BookingRepository bookingRepository;
	private final EventRepository eventRepo;
	private final UserRepository userRepo;

	public Booking book(Long eventId, int quantity, Authentication auth) throws BadRequestException {
		Event e = eventRepo.findById(eventId).orElseThrow(() -> new NotFoundException("Event not found."));
		if (quantity <= 0) {
			throw new BadRequestException("Quantity must be >0.");
		}
		if (e.getAvailableTickets() < quantity) {
			throw new BadRequestException("not enough tickets available.");
		}
		User user = userRepo.findByEmail(auth.getName()).orElseThrow();
		e.setBookedTickets(e.getBookedTickets() + quantity);
		eventRepo.save(e);
		Booking b = Booking.builder().event(e).user(user).quantity(quantity).build();
		return bookingRepository.save(b);
	}

	public List<BookingResponse> getBookingsForUser(Authentication auth) {
		User user = userRepo.findByEmail(auth.getName()).orElseThrow();

		return bookingRepository.findByUser(user).stream()
				.map(b -> new BookingResponse(b.getId(),
						new EventDto(b.getEvent().getId(), b.getEvent().getTitle(), b.getEvent().getEventDate()),
						b.getQuantity()))
				.toList();
	}
}
