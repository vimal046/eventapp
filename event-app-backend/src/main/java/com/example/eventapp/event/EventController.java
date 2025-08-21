package com.example.eventapp.event;

import java.io.IOException;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.eventapp.event.dto.EventCreateRequest;
import com.example.eventapp.event.dto.EventResponse;
import com.example.eventapp.event.dto.EventUpdateRequest;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {

	private final EventService service;

	@GetMapping
	public List<EventResponse> list() {
		return service.list();
	}

	@GetMapping("/{id}")
	public EventResponse get(@PathVariable Long id) {
		return service.get(id);
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PostMapping(consumes = { "multipart/form-data" })
	public ResponseEntity<EventResponse> create(@Valid @RequestPart("data") EventCreateRequest req,
			@RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
		return ResponseEntity.ok(service.create(req, image));
	}

	@PreAuthorize("hasRole('ADMIN')")
	@PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
	public ResponseEntity<EventResponse> update(@PathVariable Long id, @RequestPart("data") EventUpdateRequest req,
			@RequestPart(value = "image", required = false) MultipartFile image) throws IOException {
		return ResponseEntity.ok(service.update(id, req, image));
	}

	@PreAuthorize("hasRole('ADMIN')")
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> delete(@PathVariable Long id) {
		service.delete(id);
		return ResponseEntity.noContent()
				.build();
	}
}
