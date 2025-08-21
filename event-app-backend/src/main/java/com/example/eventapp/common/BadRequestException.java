package com.example.eventapp.common;

@SuppressWarnings("serial")
public class BadRequestException extends RuntimeException{

	public BadRequestException(String message) {
		super(message);
	}
}
