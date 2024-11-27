// utils/AppTimeTracker.js
import {AppState} from 'react-native';

class AppTimeTracker {
  constructor() {
    this.totalTime = 0;
    this.startTime = null;
    this.onTimeUpdate = null; // Callback to report time updates
    this.listener = null;
  }

  // Initialize the tracker
  start(onTimeUpdate) {
    this.onTimeUpdate = onTimeUpdate;

    // Add AppState listener
    this.listener = AppState.addEventListener(
      'change',
      this.handleAppStateChange.bind(this),
    );
  }

  // Handle app state changes
  handleAppStateChange(nextAppState) {
    if (nextAppState === 'active') {
      this.startTime = Date.now();
    } else if (this.startTime) {
      const timeSpent = Date.now() - this.startTime;
      this.totalTime += timeSpent;
      this.startTime = null;

      // Report the updated time
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.totalTime);
      }
    }
  }

  // Stop the tracker
  stop() {
    if (this.listener) {
      this.listener.remove();
    }
  }
}

export default new AppTimeTracker();
