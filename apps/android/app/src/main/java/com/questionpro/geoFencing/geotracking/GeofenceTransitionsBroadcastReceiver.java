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

package com.questionpro.geoFencing.geotracking;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;

import com.questionpro.geoFencing.Constants;
import com.questionpro.geoFencing.GeoUtils;
import com.questionpro.geoFencing.LocationMonitorInterface;
import com.questionpro.geoFencing.database.LocationDBManager;
import com.questionpro.model.AppUser;
import com.questionpro.pushnotification.QPPushNotification;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingEvent;
import com.questionpro.geoFencing.model.GeofenceErrorMessages;
import com.questionpro.geoFencing.model.QPLocation;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacadeHolder;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Listener for geofence transition changes.
 *
 * Receives geofence transition events from Location Services in the form of an Intent containing
 * the transition type and geofence id(s) that triggered the transition. Creates a notification
 * as the output.
 */
public class GeofenceTransitionsBroadcastReceiver extends BroadcastReceiver {

    private static final String TAG = "GeofenceTransitionsIS";


    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent != null) {

            GeofencingEvent geofencingEvent = GeofencingEvent.fromIntent(intent);
            if (geofencingEvent.hasError()) {
                handleError(context, geofencingEvent);
                return;
            }
            long locationID = intent.getLongExtra(Constants.EXTRA_LOCATION_ID, 0);
            QPLocation qpLocation = LocationDBManager.getQPLocationByID(context, locationID);

            if(null != qpLocation){
                int geofenceTransition = geofencingEvent.getGeofenceTransition();
                LocationMonitorInterface locationMonitorInterface = LocationMonitorInterface.getInstance(context);
                if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_ENTER) {

                    //Handling the case where location turned off and on re-adds the geofence.
                    // So we need to only start frequent update and not logging the fence as it is already logged.
                    //Need to test this case more.
                    if(!GeoUtils.isInsideFenceForLocation(context,qpLocation.getLocationID())){
                        locationMonitorInterface.logFenceStart(qpLocation);
                    }

                    if (LocationDBManager.getPolygonForLocation(context, qpLocation.getLocationID()).size() > 0) {
                        locationMonitorInterface.requestInsideFenceLocationUpdates(qpLocation);
                    } else {

                        long surveyId =
                                Long.parseLong(LocationDBManager.getQPLocationGroupByID(context,
                                        qpLocation.getLocationGroupID()).getSurveyIDList());
                        if (surveyId != 0) {
                            showNotification(context, surveyId, qpLocation.getLocationGroupID(),
                                    qpLocation.getLocationID());
                        }
                    }
                    Log.i(TAG, "Entered the GeoFence for Location - " + qpLocation.getAddress());

                } else if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_EXIT) {
                    locationMonitorInterface.stopInsideFenceLocationUpdate(qpLocation.getLocationID());
                    locationMonitorInterface.logFenceEnd(qpLocation);
                    Log.i(TAG, "Exited the GeoFence for Location - " + qpLocation.getAddress());
                }

            }
            else {
                Log.e(TAG, "Invalid Location");
            }

        }

    }

    public void handleError(Context context, GeofencingEvent geofencingEvent) {
        String errorMessage = GeofenceErrorMessages.getErrorString(context,
                geofencingEvent.getErrorCode());
        Log.e(TAG, errorMessage);
//        if(geofencingEvent.getErrorCode() == GeofenceStatusCodes.GEOFENCE_NOT_AVAILABLE ){
//
//            LocationMonitorInterface.getInstance(context).stopAllLocationRelatedActivities();
//            LocationMonitorInterface.getInstance(context).requestOutsideFenceLocationUpdates();
//            GeoUtils.sendNotification(context,"Please turn on Location Services.");
//        }
    }

    private void showNotification(Context context, long surveyId, long locationGroupId, long locationID){
        String uniqueKeyForAlert = getUniqueKeyForAlert(surveyId, locationID);

        if(!GeoUtils.getUniqueKeyForLocationAlert(context, uniqueKeyForAlert)) {
            AppUser appUser = AppUser.loadFromContext(context.getApplicationContext());
            if (appUser != null) {
                Bundle bundle = new Bundle();
                JSONObject jsonObject = new JSONObject();

                try {
                    jsonObject.put("type", 1);
                    jsonObject.put("memberID", appUser.ID);
                    jsonObject.put("surveyID", surveyId);
                    jsonObject.put("locationGroupID", locationGroupId);
                    jsonObject.put("locationID", locationID);
                    jsonObject.put("message", "New Survey Available");
                    bundle.putString("message", jsonObject.toString());
                    QPPushNotification qpPushNotification = new QPPushNotification(context, bundle, AppLifecycleFacadeHolder.get(), new AppLaunchHelper());
                    qpPushNotification.onPostRequest(null);
                    GeoUtils.setUniqueKeyForLocationAlert(context, uniqueKeyForAlert);

                } catch (JSONException e) {
                    e.printStackTrace();
                }

            }
        }
    }

    public String getUniqueKeyForAlert(long surveyid, long locationID) {
        String uniqueKeyForAlert = "LocId_" + locationID + "LocSurveyId_" + surveyid;
        return uniqueKeyForAlert;
    }

}
