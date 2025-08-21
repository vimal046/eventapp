package com.example.eventapp.event.dto;

import java.time.LocalDateTime;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class EventCreateRequest {

	@NotBlank
	private String title;
	
	private String description;
	
	@NotNull
	@Future
	private LocalDateTime eventDate;
	
	@Min(1)
	private int totalTickets;
}
