package com.questionpro.geoFencing;

import android.Manifest;
import android.app.Activity;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.IntentSender;
import android.location.Location;
import android.net.Uri;
import android.os.BatteryManager;
import android.util.Log;

import com.questionpro.model.AppUser;
import com.questionpro.utils.PermissionUtils;
import com.questionpro.utils.Utils;
import com.firebase.jobdispatcher.Constraint;
import com.firebase.jobdispatcher.FirebaseJobDispatcher;
import com.firebase.jobdispatcher.GooglePlayDriver;
import com.firebase.jobdispatcher.Job;
import com.firebase.jobdispatcher.Lifetime;
import com.firebase.jobdispatcher.RetryStrategy;
import com.firebase.jobdispatcher.Trigger;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResult;
import com.google.android.gms.location.LocationSettingsStates;
import com.google.android.gms.location.LocationSettingsStatusCodes;
import com.google.android.gms.maps.model.LatLng;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.google.maps.android.PolyUtil;
import com.questionpro.geoFencing.database.LocationDBManager;
import com.questionpro.geoFencing.database.LocationResponseDBHelper;
import com.questionpro.geoFencing.geotracking.GeofenceTransitionsBroadcastReceiver;
import com.questionpro.geoFencing.geotracking.LocationUpdatesBroadcastReceiver;
import com.questionpro.geoFencing.model.QPLocation;
import com.questionpro.geoFencing.model.QPLocationGroup;
import com.questionpro.geoFencing.model.QPLocationResult;
import com.questionpro.geoFencing.sync.QPUploadJobService;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.List;
import java.util.Set;

/**
 * Created by sachinsable on 1/2/18.
 */

public class LocationMonitorInterface implements OnCompleteListener<Void> {


    private Context context = null;
    private final String TAG = "LocationInterface";

    private GeofencingClient mGeofencingClient;
    private FusedLocationProviderClient mFusedLocationClient;

    private LocationMonitorInterface(Context context) {
        if (this.context == null) {
            this.context = context.getApplicationContext();
        }
        mFusedLocationClient = LocationServices.getFusedLocationProviderClient(context);
    }


    private static LocationMonitorInterface locationMonitorInterface = null;

    public static LocationMonitorInterface getInstance(Context context) {
        if (locationMonitorInterface == null) {
            locationMonitorInterface = new LocationMonitorInterface(context);
        }
        return locationMonitorInterface;
    }

    public void requestInsideFenceLocationUpdates(QPLocation qpLocation) {
        try {
            if (mFusedLocationClient == null) {
                mFusedLocationClient = LocationServices.getFusedLocationProviderClient(context);
            }
            mFusedLocationClient.requestLocationUpdates(getLocationRequest(true),
                    getPendingIntentForPolygonUpdate(qpLocation.getLocationID(), false));
            GeoUtils.setRequestingLocationInsideFenceUpdates(context, true);
        } catch (SecurityException e) {
            e.printStackTrace();
        }

    }

    public void stopInsideFenceLocationUpdate(long qpLocationID) {
        if (mFusedLocationClient == null) {
            mFusedLocationClient = LocationServices.getFusedLocationProviderClient(context);
        }
        mFusedLocationClient
                .removeLocationUpdates(getPendingIntentForPolygonUpdate(qpLocationID, true));
    }

    public void requestOutsideFenceLocationUpdates() {
        try {
            if (mFusedLocationClient == null) {
                mFusedLocationClient = LocationServices.getFusedLocationProviderClient(context);
            }
            mFusedLocationClient.requestLocationUpdates(getLocationRequest(false),
                    getPendingIntentForLocationUpdate(false));
            GeoUtils.setRequestingLocationUpdates(context, true);
            AppUser.setIsGeoFencingStarted(context, true);
        } catch (SecurityException e) {
            e.printStackTrace();
        }
    }

    private PendingIntent getPendingIntentForLocationUpdate(boolean cancellation) {

        Intent intent = new Intent(context, LocationUpdatesBroadcastReceiver.class);
        intent.setAction(LocationUpdatesBroadcastReceiver.ACTION_PROCESS_GENERAL_UPDATES);
        intent.setData(Uri.parse(intent.toUri(Intent.URI_INTENT_SCHEME)));
        return PendingIntent.getBroadcast(context, Constants.REQUEST_CODE_GENERAL,
                intent, cancellation ? 0 : PendingIntent.FLAG_UPDATE_CURRENT);
    }

    private PendingIntent getPendingIntentForPolygonUpdate(long qpLocationID, boolean cancel) {
        Intent intent = new Intent(context, LocationUpdatesBroadcastReceiver.class);
        intent.setAction(LocationUpdatesBroadcastReceiver.ACTION_PROCESS_FREQUENT_UPDATES);
        intent.setData(Uri.parse(intent.toUri(Intent.URI_INTENT_SCHEME)));
        return PendingIntent.getBroadcast(context, (int) qpLocationID,
                intent, cancel ? 0 : PendingIntent.FLAG_UPDATE_CURRENT);

    }

    public void removeLocationUpdates() {
        if (mFusedLocationClient == null) {
            mFusedLocationClient = LocationServices.getFusedLocationProviderClient(context);
        }
        GeoUtils.setRequestingLocationUpdates(context, false);
        GeoUtils.setRequestingLocationInsideFenceUpdates(context, false);

        //Remove general update
        mFusedLocationClient
                .removeLocationUpdates(getPendingIntentForLocationUpdate(true));

        //Remove inside fence updates if any
        Set<String> locationIDs = GeoUtils.getCurrentLocationsForInsideFenceUpdates(context);
        if (locationIDs != null) {
            for (String s : locationIDs) {
                mFusedLocationClient
                        .removeLocationUpdates(getPendingIntentForPolygonUpdate(Long.parseLong(s),
                                true));
            }
        }

    }

    private LocationRequest getLocationRequest(boolean insideFence) {
        LocationRequest mLocationRequest = LocationRequest.create();

        mLocationRequest.setInterval(insideFence ?
                Constants.FASTEST_UPDATE_INTERVAL :
                Constants.MAX_WAIT_TIME);
        mLocationRequest
                .setFastestInterval(insideFence ?
                        Constants.FASTEST_UPDATE_INTERVAL / 2 :
                        Constants.MAX_WAIT_TIME);
        mLocationRequest.setPriority(insideFence ?
                LocationRequest.PRIORITY_HIGH_ACCURACY :
                LocationRequest.PRIORITY_BALANCED_POWER_ACCURACY);
        return mLocationRequest;
    }

    public void setupLocationRequestWithLocationCheck(GoogleApiClient googleApiClient
            ,final Activity activity){
        LocationRequest locationRequest = getLocationRequest(false);
        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder()
                .addLocationRequest(locationRequest);
        builder.setAlwaysShow(true); //this is the key ingredient

        PendingResult<LocationSettingsResult> result =
                LocationServices.SettingsApi.checkLocationSettings(googleApiClient, builder.build());
        result.setResultCallback(new ResultCallback<LocationSettingsResult>() {
            @Override
            public void onResult(LocationSettingsResult result) {
                final Status status = result.getStatus();
                final LocationSettingsStates state = result.getLocationSettingsStates();
                switch (status.getStatusCode()) {
                    case LocationSettingsStatusCodes.SUCCESS:
                        checkPermissionAndStartLocationServices(activity);
                        break;
                    case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                        try {
                            status.startResolutionForResult(
                                    activity, Constants.LOCATION_SETTINGS_REQUEST_CODE);
                        } catch (IntentSender.SendIntentException e) {
                            //eat
                        }
                        break;
                    case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                        // Location settings are not satisfied. However, we have no way to fix the
                        // settings so we won't show the dialog.
                        break;
                }
            }
        });
    }

    public void checkPermissionAndStartLocationServices(Activity activity) {
        if(!PermissionUtils.checkPermissionGranted(activity, Manifest.permission.ACCESS_FINE_LOCATION))  {
            Log.d("Sachin","Geo Fencing not  started... Asking permission");
            PermissionUtils.checkLocationPermissions(activity);
        }
        else if(!startLocationUpdatesIfNotStarted()){
            Log.d("Sachin","Geo Fencing already  started..");
        }
    }

    public boolean startLocationUpdatesIfNotStarted(){
        if(!GeoUtils.getRequestingLocationUpdates(context)){
            Log.d("Sachin","Geo Fencing started...");
            requestOutsideFenceLocationUpdates();
            return true;
        }
        return false;
    }

    public void setGeoFencesForCurrentLocation(Location location) {

        ArrayList<Long> geoFencesAlreadyAdded = getAlreadyAddedGeoFenceIDs();
        Log.i("Sachin", "Already added- " + geoFencesAlreadyAdded.size());
        ArrayList<QPLocation> qpLocations = LocationDBManager.getLocationsSurveyFromDB(context,
                location.getLatitude(), location.getLongitude(),
                Utils.metersToFeet(Constants.INITIAL_FENCE_RADIUS_IN_METERS));

        //Filtering locations so that it won't add the existing geo fences again and will add new ones.
        ArrayList<Long> geoFenceTobeAdded = new ArrayList<>();
        for (QPLocation qpLocation : qpLocations) {
            geoFenceTobeAdded.add(qpLocation.getLocationID());
        }
        geoFenceTobeAdded = removeObsoluteGeoFenceAndGetFilteredLocationsList(geoFencesAlreadyAdded,
                geoFenceTobeAdded);

        Log.i("Sachin", "New Additions Size- " + geoFenceTobeAdded.size());

        for (Long locationID : geoFenceTobeAdded) {
            if (!GeoUtils.isGeoFenceAdded(context, locationID)) {
                addGeoFenceForLocation(locationID);
            }
        }


    }

    private void addGeoFenceForLocation(Long locationID) {
        GeofencingClient mGeofencingClient = LocationServices.getGeofencingClient(context);
        Log.i(TAG, "Adding geo fence for - " + locationID);
        GeoUtils.addGeoFence(context, locationID);
        try { //Expecting that the permissions are already given.
            QPLocation qpLocation = LocationDBManager.getQPLocationByID(context, locationID);
            mGeofencingClient.addGeofences(getGeofencingRequest(qpLocation),
                    getGeofencePendingIntent(qpLocation))
                    .addOnCompleteListener(this);
        } catch (SecurityException e) {
            e.printStackTrace();
        }
    }

    private ArrayList<Long> removeObsoluteGeoFenceAndGetFilteredLocationsList(ArrayList<Long> geoFencesAlreadyAdded, ArrayList<Long> qpLocations) {
        ArrayList<Long> geoFenceTobeAdded = new ArrayList<>();
        geoFenceTobeAdded.addAll(qpLocations);
        geoFenceTobeAdded.removeAll(geoFencesAlreadyAdded);
        Log.i("Sachin", "To be added- " + geoFenceTobeAdded);
        geoFencesAlreadyAdded.removeAll(qpLocations);
        Log.i("Sachin", "To be Removed- " + geoFencesAlreadyAdded);
        for (Long qpLocation : geoFencesAlreadyAdded) {
            removeGeoFenceForLocation(qpLocation);
        }
        return geoFenceTobeAdded;


    }

    private ArrayList<Long> getAlreadyAddedGeoFenceIDs() {
        ArrayList<Long> ids = new ArrayList<>();
        Set<String> fences = GeoUtils.getGeoFences(context);
        if (null != fences) {
            for (String id : fences) {
                ids.add(Long.parseLong(id));
            }
        }
        return ids;
    }

    public void removeGeoFencesForIds(ArrayList<String> ids) {
        if (mGeofencingClient == null) {
            mGeofencingClient = LocationServices.getGeofencingClient(context);
        }
        mGeofencingClient.removeGeofences(ids);
        GeoUtils.removeGeoFencesForIds(context, ids);
    }

    public void removeAllGeoFences() {
        if (mGeofencingClient == null) {
            mGeofencingClient = LocationServices.getGeofencingClient(context);
        }

        Set<String> set = GeoUtils.getGeoFences(context);
        ArrayList<String> arrayList = new ArrayList<String>();
        if (set != null) {
            for (String str : set) {
                arrayList.add(str);
            }
            if (arrayList.size() > 0) {
                mGeofencingClient.removeGeofences(arrayList);
                GeoUtils.removeAllGeoFences(context);
            }
        }

    }

    public void removeGeoFenceForLocation(long locationID) {
        if (mGeofencingClient == null) {
            mGeofencingClient = LocationServices.getGeofencingClient(context);
        }
        mGeofencingClient.removeGeofences(new ArrayList<>(Arrays.asList(locationID + "")));
        GeoUtils.removeGeoFence(context, "" + locationID);

    }

    private PendingIntent getGeofencePendingIntent(QPLocation location) {
        QPLocationGroup qpLocationGroup = LocationDBManager.getQPLocationGroupByID(context, location.getLocationGroupID());

        Intent intent = new Intent(context, GeofenceTransitionsBroadcastReceiver.class);
        intent.putExtra(LocationAlertReceiverService.EXTRA_LOCATION_ID, location.getLocationID());
        intent.putExtra(LocationAlertReceiverService.EXTRA_LOCATION_SURVEY_PANEL_MEMBER_ID, qpLocationGroup.getPanelID());
        intent.putExtra(LocationAlertReceiverService.EXTRA_LOCATION_GROUP_ID, qpLocationGroup.getLocationGroupID());
        intent.putExtra(LocationAlertReceiverService.EXTRA_DISPLAY_VALUE, qpLocationGroup.getName());
        return PendingIntent.getBroadcast(context, (int) location.getLocationID(), intent, PendingIntent.FLAG_UPDATE_CURRENT);
    }


    private GeofencingRequest getGeofencingRequest(QPLocation qpLocation) {
        GeofencingRequest.Builder builder = new GeofencingRequest.Builder();
        builder.setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_ENTER);

        builder.addGeofence(buildAndGetGeoFence(qpLocation.getLocation(), qpLocation.getId()));

        return builder.build();
    }


    private Geofence buildAndGetGeoFence(Location location, long id) {
        return new Geofence.Builder()
                .setRequestId(id + "")
                .setCircularRegion(
                        location.getLatitude(),
                        location.getLongitude(),
                        Constants.GEOFENCE_RADIUS_IN_METERS
                )
                .setExpirationDuration(Constants.GEOFENCE_EXPIRATION_IN_MILLISECONDS)
                .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_ENTER
                        | Geofence.GEOFENCE_TRANSITION_EXIT)
                .setLoiteringDelay(10000)
                .build();
    }

    @Override
    public void onComplete(Task<Void> task) {
        Log.i(TAG, "Add Geo Fencing task complete.");
    }

    public boolean checkIfLocationIsInsidePolygon(Location location, List<LatLng> polygon) {
        return PolyUtil.containsLocation(location.getLatitude(), location.getLongitude(), polygon, false);
    }

    public void logPolygonStart(QPLocation qpLocation) {
        long startTime = Utils.getTimeInMillisecondsForTimeZone("GMT"); //Saving GMT time
        long uniqueKey = Calendar.getInstance().getTimeInMillis();
        QPLocationResult qpLocationResult = new QPLocationResult(qpLocation.getLocationGroupID(),
                qpLocation.getLocationID(), qpLocation.getAddress(),
                QPLocationResult.TrackType.POLYGON,
                QPLocationResult.TrackMovementType.ENTRY, startTime, getBatteryPercentage(), uniqueKey);
        GeoUtils.setPolygonUniqueKey(context,uniqueKey);
        LocationResponseDBHelper.getInstance(context).insert(qpLocationResult);
       // GeoUtils.sendNotification(context, "Store entry for " + qpLocation.getAddress() + " !", "Polygon Entry");
    }


    public void logPolygonEnd(QPLocation qpLocation) {

        long endTime = Utils.getTimeInMillisecondsForTimeZone("GMT");
        long uniqueKey = GeoUtils.getPolygonUniqueKey(context);
        QPLocationResult qpLocationResult = new QPLocationResult(qpLocation.getLocationGroupID(),
                qpLocation.getLocationID(), qpLocation.getAddress(),
                QPLocationResult.TrackType.POLYGON,
                QPLocationResult.TrackMovementType.EXIT, endTime, getBatteryPercentage(),uniqueKey );
        LocationResponseDBHelper.getInstance(context).insert(qpLocationResult);
        GeoUtils.clearPolygonUniqueKey(context);
        //GeoUtils.sendNotification(context, "Store exit for " + qpLocation.getAddress() + " !", "Polygon Exit");
    }

    public void logFenceStart(QPLocation qpLocation) {
        long startTime = Calendar.getInstance().getTimeInMillis();

        GeoUtils.setRequestingInsideFenceLocationUpdatesForLocation(context, qpLocation.getLocationID());
//        QPLocationResult qpLocationResult = new QPLocationResult(qpLocation.getLocationGroupID(),
//                qpLocation.getLocationID(), qpLocation.getAddress(),
//                QPLocationResult.TrackType.FENCE,
//                QPLocationResult.TrackMovementType.ENTRY, startTime, getBatteryPercentage());
        //LocationResponseDBHelper.getInstance(context).insert(qpLocationResult);
       // GeoUtils.sendNotification(context, "Fence entry for " + qpLocation.getAddress() + " !");
    }

    public void logFenceEnd(QPLocation qpLocation) {

        long endTime = Calendar.getInstance().getTimeInMillis();
        GeoUtils.deleteLocationForFenceUpdate(context, qpLocation.getLocationID());
//        QPLocationResult qpLocationResult = new QPLocationResult(qpLocation.getLocationGroupID(),
//                qpLocation.getLocationID(), qpLocation.getAddress(),
//                QPLocationResult.TrackType.FENCE,
//                QPLocationResult.TrackMovementType.EXIT, endTime, getBatteryPercentage());
        //LocationResponseDBHelper.getInstance(context).insert(qpLocationResult);
        //GeoUtils.sendNotification(context, "Fence exit for " + qpLocation.getAddress() + " !");
        GeoUtils.clearPolygonUniqueKey(context);
    }


    public String getBatteryPercentage() {
        IntentFilter intentFilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        Intent batteryStatus = context.registerReceiver(null, intentFilter);
        return batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1) + "";
    }

    public void scheduleLocationResultUploadJob() {
        FirebaseJobDispatcher dispatcher = new FirebaseJobDispatcher(new GooglePlayDriver(context));
        Job job = createJob(dispatcher);
        dispatcher.schedule(job);
    }

    private Job createJob(FirebaseJobDispatcher firebaseJobDispatcher) {

        return firebaseJobDispatcher.newJobBuilder()
                .setService(QPUploadJobService.class)
                .setTag(Constants.UPLOAD_RESULT_TAG)
                .setConstraints(Constraint.ON_ANY_NETWORK)
                .setLifetime(Lifetime.FOREVER)
                .setRecurring(true)
                .setTrigger(Trigger.executionWindow(Constants.PERIODICITY, Constants.PERIODICITY + Constants.TOLERANCE_INTERVAL))
                .setRetryStrategy(RetryStrategy.DEFAULT_EXPONENTIAL)
                .setReplaceCurrent(true)
                .build();
        }

    public void cancelLocationResultUploadJob() {
        FirebaseJobDispatcher dispatcher = new FirebaseJobDispatcher(new GooglePlayDriver(context));
        dispatcher.cancel(Constants.UPLOAD_RESULT_TAG);
    }

    public void stopAllLocationRelatedActivities() {
        removeAllGeoFences();
        removeLocationUpdates();
        cancelLocationResultUploadJob();
    }

}
