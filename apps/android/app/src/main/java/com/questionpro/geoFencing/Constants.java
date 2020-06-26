/*
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.questionpro.geoFencing;

import com.google.android.gms.location.Geofence;

import java.util.concurrent.TimeUnit;

/**
 * Constants used in this sample.
 */

public final class Constants {

    /**
     * All the time constants for Location Receivers
     */

    public static final long UPDATE_INTERVAL = 60000; // Every 60 seconds.
    public static final long MAX_WAIT_TIME = UPDATE_INTERVAL * 3; // Every 3 minutes.
    public static final long FASTEST_UPDATE_INTERVAL = 1000; // Every second
    public static final float LOCATION_ACCURACY_THRESHOLD = 50.0f;
    public static final int LOCATION_SETTINGS_REQUEST_CODE = 1000;
    public static final String UPLOAD_RESULT_TAG = "qp-upload-result";

    /**
     * Upload result parameters keys
     */
    public static final  int PERIODICITY = (int) TimeUnit.HOURS.toSeconds(24); // Every 24 hours PERIODICITY expressed as seconds
    public static final int TOLERANCE_INTERVAL = (int) TimeUnit.HOURS.toSeconds(1);

    private Constants() {
    }

    public static final String EXTRA_DISPLAY_VALUE = "EXTRA_DISPLAY_VALUE";
    public static final String EXTRA_LOCATION_ID = "EXTRA_LOCATION_ID";
    public static final String EXTRA_LOCATION_SURVEY_ID = "EXTRA_LOCATION_SURVEY_ID";
    public static final String EXTRA_LOCATION_GROUP_ID = "EXTRA_LOCATION_GROUP_ID";
    public static final String EXTRA_LOCATION_SURVEY_PANEL_MEMBER_ID="EXTRA_PANEL_MEMBER_ID";
    public static final String EXTRA_SURVEY_ID = "EXTRA_SURVEY_ID";

    public static final int REQUEST_CODE_GENERAL = 111;

    /**
     * Used to set an expiration time for a geofence. After this amount of time Location Services
     * stops tracking the geofence.
     */
    public static final long GEOFENCE_EXPIRATION_IN_HOURS = 12;

    /**
     * For this sample, geofences expire after twelve hours.
     */
    public static final long GEOFENCE_EXPIRATION_IN_MILLISECONDS =
            Geofence.NEVER_EXPIRE;
    public static final float GEOFENCE_RADIUS_IN_METERS = 300;

    public static final int INITIAL_FENCE_RADIUS_IN_METERS = 3000;



}
