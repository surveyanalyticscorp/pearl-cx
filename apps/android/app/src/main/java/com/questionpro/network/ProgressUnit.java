package com.questionpro.network;

public class ProgressUnit {
	
	public static final int FATAL_ERROR = -1;
	
	private int progress;
	private String message;

	public ProgressUnit(String message, int progress) {
		this.message = message;
		this.progress = progress;
	}

	public String getMessage() {
		return message;
	}

	public int getProgress() {
		return progress;
	}
}