/**
 * TypeScript type definitions for QuestionPro Survey Intercept SDK
 */

import { DataCenter } from ".";

/**
 * Configuration options for the Survey SDK
 */
export interface ConfigureOptions {
  /** Required API key for authentication */
  apiKey: string;
  /** Optional flag to enable debug mode */
  enableDebug?: boolean;
  /** Required data center for the SDK */
  dataCenter: DataCenter;
}

/**
 * Event data structure for survey events
 */
interface SurveyEvent {
  /** Type of the event */
  type: 'survey_shown' | 'survey_completed' | 'survey_dismissed' | 'error';
  /** Optional event data */
  data?: {
    /** Survey ID when applicable */
    surveyId?: string;
    /** Survey responses for completed surveys */
    responses?: Record<string, any>;
    /** Error message for error events */
    message?: string;
    /** Additional event-specific data */
    [key: string]: any;
  };
}

/**
 * Event callback function type
 */
export type EventCallback = (event: SurveyEvent) => void;

/**
 * Function to unsubscribe from events
 */
export type UnsubscribeFunction = () => void;

/**
 * Parameters for notifyEvent method
 */
export interface EventParams {
  [key: string]: any;
}

export interface DataMapping {
  [key: string]: string;
}
