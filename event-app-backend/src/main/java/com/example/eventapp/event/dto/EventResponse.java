package com.example.eventapp.event.dto;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class EventResponse {

	private Long id;
	private String title;
	private String description;
	private LocalDateTime evetDate;
	private int totalTickets;
	private int bookedTickets;
	private int availableTickets;
	private String imageUrl;
}
