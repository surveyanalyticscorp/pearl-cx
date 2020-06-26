package com.questionpro.geoFencing;

import android.app.IntentService;
import android.content.Intent;
import android.location.Location;
import android.util.Log;

import androidx.annotation.Nullable;

import java.util.ArrayList;

/**
 * Created by Dattatraya Kunde on 26/09/17.
 */

public class GetLocationAlertService extends IntentService{

    public GetLocationAlertService()
    {
        super("GetLocationAlertService");
    }

    public GetLocationAlertService(String name) {
        super(name);
    }

    @Override
    protected void onHandleIntent(@Nullable Intent intent) {
        Log.d("Datta", "Get location alert service onHandleIntent ....");

        /*** get the current location of device*/
        try {
            LocationService.LocationResult locationResult = new LocationService.LocationResult(){
                @Override
                public void gotLocation(Location location){
                    //Got the location!
                    if(null != location) {
                        Log.d("Datta", "Location: " + location.getLongitude() + ":" + location.getLatitude());
                        setAlertsForCurrentLocation(location);
                    }
                }
            };
            LocationService myLocation = new LocationService();
            myLocation.getLocation(this, locationResult);

        } catch (Exception e) {e.printStackTrace();}
    }

    /**
     *
     * @param location
     */
    private void setAlertsForCurrentLocation(Location location){
        /*** to get the surveys in particular radius  pass current location to find near by location survey*/
        ArrayList<LocationGroups> locationGroups=new ArrayList<LocationGroups>();
        ArrayList<LocationAlert> locations=new ArrayList<LocationAlert>();

       // locationGroups= LocationDBManager.getAllLocationGroups(this);
        //int maxxRadius=LocationDBManager.getMaxRadiusFromLocationGroup(this);//get maxx radius to find survey from that radius
        //locations=LocationDBManager.getLocationsSurveyFromDB(this,location.getLatitude(),location.getLongitude(),maxxRadius);//used 50000 for testing only
        //Log.d("Datta",  "Locations survey list size:..."+locations.size());


        try {
            if (locations.size()>0)/** Got location group ids in given radius*/
            {
                LocationAlert.enableLocationAlert(this, false);//for clearing all old location alerts

                LocationGroups.saveLocationsGroups(this, locationGroups);
                LocationAlert.saveLocationsAlerts(this, locations);

                LocationAlert.enableLocationAlert(this, true);
            }
        } catch (Exception e) {e.printStackTrace();}
    }
}
