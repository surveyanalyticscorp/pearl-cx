package com.questionpro.geoFencing.geotracking;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.questionpro.geoFencing.GeoUtils;
import com.questionpro.geoFencing.LocationMonitorInterface;
import com.questionpro.model.AppUser;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResponse;
import com.google.android.gms.location.LocationSettingsStates;
import com.google.android.gms.location.SettingsClient;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;
import com.questionpro.whitelabelapps.R;

/**
 * Created by sachinsable on 2/20/18.
 */

public class LocationSettingsReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(final Context context, Intent intent) {
        if (intent.getAction().matches("android.location.PROVIDERS_CHANGED") &&
                AppUser.isLoggedIn(context.getApplicationContext())) {
            LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder();
            SettingsClient client = LocationServices.getSettingsClient(context);
            Task<LocationSettingsResponse> task = client.checkLocationSettings(builder.build());
            task.addOnCompleteListener(new OnCompleteListener<LocationSettingsResponse>() {
                @Override
                public void onComplete(@NonNull Task<LocationSettingsResponse> task) {
                    LocationSettingsStates locationSettingsStates = task.getResult().getLocationSettingsStates();
                    Log.i("Sachin","GPS : "+ task.getResult().getLocationSettingsStates().isGpsUsable());
                    Log.i("Sachin","Network : "+ task.getResult().getLocationSettingsStates().isNetworkLocationUsable());
                    if(locationSettingsStates.isGpsUsable() || locationSettingsStates.isNetworkLocationUsable()){
                        LocationMonitorInterface.getInstance(context)
                                .startLocationUpdatesIfNotStarted();
                    }
                    else{
                        LocationMonitorInterface.getInstance(context).stopAllLocationRelatedActivities();
                        GeoUtils.sendNotification(context,
                                "Location settings must be turned on for "+
                                        context.getResources().getString(R.string.app_name) +" to work.", "Location Turned OFF!");
                    }
                }
            });
        }

    }
}
