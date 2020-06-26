package com.questionpro.reactnative.modules;

import android.app.Activity;
import android.os.Bundle;
import android.util.Log;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;

import com.questionpro.model.AppUser;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;
import com.facebook.react.bridge.Callback;
import com.questionpro.geoFencing.LocationMonitorInterface;
import com.questionpro.geoFencing.database.LocationResponseDBHelper;
import com.questionpro.geoFencing.sync.LocationDatabaseUpdateTask;
import com.questionpro.geoFencing.sync.QPLocationResultUploadTask;

/**
 * Created by sachinsable on 9/25/17.
 */

public class LocationModule extends ReactContextBaseJavaModule implements
        GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener{

    private ReactApplicationContext reactContext;
    private Activity activity;
    private GoogleApiClient googleApiClient;
    private final String TAG = "LocationModule";
    public LocationModule(ReactApplicationContext reactContext, Activity activity) {
        super(reactContext);
        this.reactContext=reactContext;
        this.activity = activity;
    }

    @Override
    public String getName() {
        return "LocationModule";
    }


    @ReactMethod
    public void updateDatabaseFileLocation(String dbLocation){
        Log.d("Datta","Database Location: "+dbLocation);

        if(!dbLocation.matches("")) {
            AppUser.saveLocationSurveyDBLocation(activity,dbLocation);
            LocationMonitorInterface.getInstance(reactContext).scheduleLocationResultUploadJob();
            enableLocation(activity);
        }
    }

    @ReactMethod
    public void deleteLocationResults(){
        LocationResponseDBHelper.getInstance(getCurrentActivity()).deleteResponses();
    }

    private void enableLocation(final Activity activity){

        googleApiClient = new GoogleApiClient.Builder(activity)
                .addApi(LocationServices.API)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this).build();
        googleApiClient.connect();

    }

    @ReactMethod
    public void checkVersionAndDownloadLocationDatabase(final Callback successCallback,final Callback errorCallback){
        Log.i(TAG, "Checking to update location database");
        LocationDatabaseUpdateTask locationDatabaseUpdateTask
                = new LocationDatabaseUpdateTask(reactContext, new QPLocationResultUploadTask.ResultCallback() {
            @Override
            public void onSuccess(Object result) {
                successCallback.invoke((String) result);
            }

            @Override
            public void onFailure(Object error) {
                errorCallback.invoke(error);
            }
        });
        locationDatabaseUpdateTask.execute();


    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        LocationMonitorInterface.getInstance(activity)
                .setupLocationRequestWithLocationCheck(googleApiClient,activity);
    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }

    @Override
    public void onConnectionSuspended(int i) {

    }

}
