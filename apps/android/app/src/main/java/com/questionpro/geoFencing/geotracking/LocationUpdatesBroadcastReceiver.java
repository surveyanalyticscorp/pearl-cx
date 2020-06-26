/**
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

package com.questionpro.geoFencing.geotracking;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.location.Location;
import android.util.Log;

import com.questionpro.app.CoreApplication;
import com.questionpro.geoFencing.Constants;
import com.questionpro.geoFencing.GeoUtils;
import com.questionpro.geoFencing.LocationMonitorInterface;
import com.questionpro.geoFencing.database.LocationDBManager;
import com.questionpro.model.AppUser;
import com.google.android.gms.location.LocationResult;
import com.google.android.gms.maps.model.LatLng;
import com.questionpro.geoFencing.model.QPLocation;

import java.util.Iterator;
import java.util.List;
import java.util.Set;

public class LocationUpdatesBroadcastReceiver extends BroadcastReceiver {
    public static final String ACTION_PROCESS_GENERAL_UPDATES =
            "com.questionpro." +
                    ".PROCESS_GENERAL_UPDATES";
    public static final String ACTION_PROCESS_FREQUENT_UPDATES =
            "com.questionpro."+"PROCESS_FREQUENT_UPDATES";
    private static final String TAG = "LUBroadcastReceiver";


    @Override
    public void onReceive(Context context, Intent intent) {
        if (null != intent) {
            LocationMonitorInterface locationMonitorInterface = LocationMonitorInterface.getInstance(context);
            if (Intent.ACTION_BOOT_COMPLETED.equals(intent.getAction())) {
                handleBootUpAction(context);
                return;
            }

            final String action = intent.getAction();
            LocationResult result = LocationResult.extractResult(intent);
            if (result != null) {
                Location location = result.getLastLocation();
                float accuracy = location.getAccuracy();
                Log.i("Sachin", "Accuracy- " + accuracy);
                Log.i("Sachin", "Altitude - " + location.getAltitude());

                if (accuracy > 0.0f) {
                    if (ACTION_PROCESS_GENERAL_UPDATES.equals(action)) {
                        LocationMonitorInterface.getInstance(context).setGeoFencesForCurrentLocation(location);
                        Log.i(TAG, "Location General update");
                    } else if (ACTION_PROCESS_FREQUENT_UPDATES.equals(action)) {
                        Log.i(TAG, "Location Frequent update");
                        Set<String> locations = GeoUtils.getCurrentLocationsForInsideFenceUpdates(context);
                        Iterator<String> it = locations.iterator();
                        while (it.hasNext()) {
                            long locationID = Long.parseLong(it.next());
                            QPLocation qpLocation = LocationDBManager.getQPLocationByID(context, locationID);

                            if (null != qpLocation) {
                                List<LatLng> polygon = LocationDBManager.getPolygonForLocation(context, locationID);
                                if (polygon.size() > 0) {
                                    boolean isInsidePolygon = locationMonitorInterface.checkIfLocationIsInsidePolygon(location, polygon);
                                    if (isInsidePolygon && !GeoUtils.isAlreadyInsidePolygon(context, locationID)
                                            && GeoUtils.getCurrentTrackingPolygonID(context) == 0) {
                                        GeoUtils.setInsidePolygon(context, locationID, true);
                                        GeoUtils.setCurrentTrackingPolygonID(context, locationID);
                                        locationMonitorInterface.logPolygonStart(qpLocation);
                                        //GeoUtils.sendNotification(context, "Welcome to " + qpLocation.getAddress() + " !");
//
                                    } else if (accuracy < Constants.LOCATION_ACCURACY_THRESHOLD
                                            && !isInsidePolygon
                                            && GeoUtils.isAlreadyInsidePolygon(context, qpLocation.getLocationID())) {
                                        GeoUtils.setInsidePolygon(context, locationID, false);
                                        locationMonitorInterface.logPolygonEnd(qpLocation);
                                        GeoUtils.clearCurrentTrackingPolygonID(context);
                                        //GeoUtils.sendNotification(context, "Thank you for visiting " + qpLocation.getAddress() + " !");
                                    }
                                }
                            }
                        }

                    }
                }
            }
        }
    }

    private void handleBootUpAction(Context context) {
        LocationMonitorInterface locationMonitorInterface = LocationMonitorInterface.getInstance(context);
        AppUser appUser = AppUser.loadFromContext(CoreApplication.getContext());
        if(appUser != null) {
            Log.i("Sachin", "Boot Complete. Resetting Geo Fences.");
            locationMonitorInterface.stopAllLocationRelatedActivities();
            locationMonitorInterface.requestOutsideFenceLocationUpdates();
            locationMonitorInterface.scheduleLocationResultUploadJob();
        }
    }

}
