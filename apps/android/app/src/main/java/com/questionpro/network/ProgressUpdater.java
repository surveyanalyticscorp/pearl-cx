package com.questionpro.network;

public interface ProgressUpdater {
	public void updateProgress(ProgressUnit unit);



	public static class SilentProgressUpdater implements ProgressUpdater {
		public void updateProgress(ProgressUnit unit) {
			// Do nothing
		}
	}

}