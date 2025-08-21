package com.example.eventapp.event.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class EventUpdateRequest {

	private String title;
	private String description;
	private LocalDateTime eventDate;
	private Integer totalTickets;
}
