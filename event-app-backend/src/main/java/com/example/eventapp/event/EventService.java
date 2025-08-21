package com.example.eventapp.event;

import java.io.IOException;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.example.eventapp.common.NotFoundException;
import com.example.eventapp.event.dto.EventCreateRequest;
import com.example.eventapp.event.dto.EventResponse;
import com.example.eventapp.event.dto.EventUpdateRequest;
import com.example.eventapp.file.FileStorageService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EventService {
	private final EventRepository repo;
	private final FileStorageService storage;

	public EventResponse create(EventCreateRequest req, MultipartFile image) throws IOException {
		String filename = image != null ? storage.store(image) : null;
		Event e = Event.builder()
				.title(req.getTitle())
				.description(req.getDescription())
				.eventDate(req.getEventDate())
				.totalTickets(req.getTotalTickets())
				.bookedTickets(0)
				.imagePath(filename)
				.build();
		e = repo.save(e);
		return toDto(e);
	}

	public EventResponse update(Long id, EventUpdateRequest req, MultipartFile image) throws IOException {
		Event e = repo.findById(id)
				.orElseThrow(() -> new NotFoundException("Event not found"));
		if (req.getTitle() != null) {
			e.setTitle(req.getTitle());
		}
		if (req.getDescription() != null) {
			e.setDescription(req.getDescription());
		}
		if (req.getEventDate() != null) {
			e.setEventDate(req.getEventDate());
		}
		if (req.getTotalTickets() != null) {
			e.setTotalTickets(req.getTotalTickets());
		}
		if (image != null) {
			e.setImagePath(storage.store(image));
		}
		return toDto(repo.save(e));
	}

	public void delete(Long id) {
		repo.deleteById(id);
	}

	public List<EventResponse> list() {
		return repo.findAll()
				.stream()
				.map(this::toDto)
				.toList();
	}

	public EventResponse get(Long id) {
		return toDto(repo.findById(id)
				.orElseThrow(() -> new NotFoundException("Event not found.")));
	}

	private EventResponse toDto(Event e) {
		String imageUrl = e.getImagePath() != null ? "/images/" + e.getImagePath() : null;

		return EventResponse.builder()
				.id(e.getId())
				.title(e.getTitle())
				.description(e.getDescription())
				.evetDate(e.getEventDate())
				.totalTickets(e.getTotalTickets())
				.bookedTickets(e.getBookedTickets())
				.availableTickets(e.getAvailableTickets())
				.imageUrl(imageUrl)
				.build();
	}
}
