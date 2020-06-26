package com.questionpro.geoFencing;

import android.annotation.SuppressLint;
import android.app.AlarmManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.location.LocationManager;
import android.util.Log;

import com.questionpro.service.JSONenabled;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;

/**
 * Created by Dattatraya Kunde on 26/09/17.
 */

public class LocationAlert implements JSONenabled,Serializable{

    private int id = 0;
    private int locationId=0;
    private int locationGroupId=0;
    private String address;
    private double latitude =0.0;
    private double longitude = 0.0;

    private static final String PREF_NAME_LOCATION_ALERTS = "PrefLocationAlert";
    private static final String LOCATION_ALERTS_PREFS_KEY = "LOCATION_ALERTS_PREFS_KEY";

    //public static final String SURVEY_LOCATION_ALERT = "SURVEY_LOCATION_ALERT";
    //public static final String ACC_LOCATION_ALERT = "ACC_LOCATION_ALERT";
    private static List<LocationAlert> savedLocationsAlerts = null;

    public LocationAlert(){}

    public LocationAlert(int id,int locationId,int locationGroupId,String address,double lat, double _long)
    {
        this.id = id;
        this.locationId=locationId;
        this.locationGroupId=locationGroupId;
        this.address=address;
        this.latitude=lat;
        this.longitude=_long;

    }

    /**
     *
     * @param cntx
     * @param enable
     */
    public static void setAlarmForFetchingLocationAlert(Context cntx, boolean enable){

        AlarmManager mAm = (AlarmManager) cntx.getSystemService(Context.ALARM_SERVICE);
        Intent alarmReceiver = new Intent(cntx, GetLocationAlertService.class);
        PendingIntent piAlarmReceiver = PendingIntent.getService(cntx, 0, alarmReceiver, 0);
        if(enable)
        {
            Calendar now = Calendar.getInstance();
            int interval = 2 * 60 * 1000;
            mAm.setRepeating(AlarmManager.RTC_WAKEUP, now.getTimeInMillis(), interval, piAlarmReceiver);
        }
        else{
            mAm.cancel(piAlarmReceiver);
        }
    }

    /**
     * This function is to activate the location alert
     * @param context
     * @param enable
     */
    @SuppressLint("UseSparseArrays")
    public static void enableLocationAlert(Context context, boolean enable)
    {
        LocationManager lm = (LocationManager) context.getSystemService(Context.LOCATION_SERVICE);
        if(lm==null){
            return;
        }

        List<LocationAlert> alerts = getSavedLocationAlerts(context);
        List<LocationGroups> locationGroups=LocationGroups.getSavedLocationAlerts(context);
        HashMap<Integer, LocationGroups> locationGroupMap=new HashMap<Integer, LocationGroups>();
        if(enable)
        {
            for(LocationGroups group:locationGroups)
            {
                locationGroupMap.put(group.location_group_id, group);
            }
            for(int i=0;i<alerts.size();i++)
            {
                LocationAlert alert =  alerts.get(i);

                Log.d("Datta", "Set location base survey:"+locationGroupMap.get(alert.getLocationGroupId()).getName());
                long surveyId=locationGroupMap.get(alert.getLocationGroupId()).getSurvey_id_list();

                Intent intent = new Intent(context, LocationAlertReceiverService.class);
                intent.putExtra(LocationAlertReceiverService.EXTRA_LOCATION_SURVEY_ID, alert.getLocationId());
                intent.putExtra(LocationAlertReceiverService.EXTRA_LOCATION_ID,alert.getId());
                intent.putExtra(LocationAlertReceiverService.EXTRA_LOCATION_SURVEY_PANEL_MEMBER_ID, locationGroupMap.get(alert.getLocationGroupId()).getPanel_id());
                intent.putExtra(LocationAlertReceiverService.EXTRA_SURVEY_ID,surveyId);
                intent.putExtra(LocationAlertReceiverService.EXTRA_LOCATION_GROUP_ID, locationGroupMap.get(alert.getLocationGroupId()).getLocation_group_id());
                intent.putExtra(LocationAlertReceiverService.EXTRA_DISPLAY_VALUE,locationGroupMap.get(alert.getLocationGroupId()).getName());
                //intent.putExtra(LocationAlertReceiverService.EXTRA_TYPE,type);

                float radiousInMeter = 0;
                try {
                    int radiusInFeet=locationGroupMap.get(alert.locationGroupId).radious;
                    radiousInMeter=(float) (radiusInFeet/3.2808);
                } catch (Exception e) {e.printStackTrace();}
                PendingIntent pIntent = PendingIntent.getService(context, alert.getId(), intent, PendingIntent.FLAG_CANCEL_CURRENT);
                try {
                    lm.addProximityAlert(alert.getLatitude(), alert.getLongitude(), radiousInMeter, -1, pIntent);
                }catch (SecurityException e){e.toString();}
                //lm.addProximityAlert(18.518918,73.777528, 1000, -1, pIntent);
            }
        }
        else
        {
            for(int i=0;i<alerts.size();i++)
            {
                LocationAlert alert =  alerts.get(i);
                Intent intent = new Intent(context, LocationAlertReceiverService.class);
                PendingIntent pIntent = PendingIntent.getBroadcast(context, alert.getId(), intent, PendingIntent.FLAG_CANCEL_CURRENT);
                lm.removeProximityAlert(pIntent);
            }
            clearSavedLocationAlerts(context);
            LocationGroups.clearSavedLocationg(context);
        }
    }

    /**
     *
     * @param cntx
     * @param alerts
     */
    synchronized public static void saveLocationsAlerts(Context cntx, List<LocationAlert> alerts){
        List<LocationAlert> oldAlerts = getSavedLocationAlerts(cntx);
        oldAlerts.addAll(alerts);
        JSONArray alertJsonArray = new JSONArray();
        SharedPreferences prefs = cntx.getSharedPreferences(PREF_NAME_LOCATION_ALERTS, Context.MODE_PRIVATE);
        for(LocationAlert alrt : oldAlerts)
        {
            alertJsonArray.put(alrt.toJSONObj());
        }
        SharedPreferences.Editor edt = prefs.edit();
        edt.putString(LOCATION_ALERTS_PREFS_KEY, alertJsonArray.toString());
        edt.commit();
    }

    /**
     *
     * @param cntx
     * @return
     */
    static List<LocationAlert> getSavedLocationAlerts(Context cntx)
    {
        SharedPreferences prefs = cntx.getSharedPreferences(PREF_NAME_LOCATION_ALERTS , Context.MODE_PRIVATE);
        if(savedLocationsAlerts!=null)
        {
            return savedLocationsAlerts;
        }
        else{
            String savedAlertsStr = prefs.getString(LOCATION_ALERTS_PREFS_KEY, "");
            savedLocationsAlerts = parseLocationAlerts(savedAlertsStr);
        }

        if(savedLocationsAlerts==null)
        {
            savedLocationsAlerts = new ArrayList<LocationAlert>();
            clearSavedLocationAlerts(cntx);

            //for test
            //saveLocationAlert(cntx,new LocationAlert(0, 27.70402, 85.31732, 500, 123, "Hello1"));
            //saveLocationAlert(cntx,new LocationAlert(1, 40.71435, -74.00597, 500, 124, "Hello2"));
        }

        return savedLocationsAlerts;
    }

    /**
     *
     * @param cntx
     */
    synchronized static void clearSavedLocationAlerts(Context cntx)
    {
        SharedPreferences prefs = cntx.getSharedPreferences(PREF_NAME_LOCATION_ALERTS , Context.MODE_PRIVATE);
        savedLocationsAlerts.clear();
        SharedPreferences.Editor edt =prefs.edit();
        edt.remove(LOCATION_ALERTS_PREFS_KEY);
        edt.commit();
    }

    /**
     *
     * @param alertArray
     * @return
     */
    static List<LocationAlert> parseLocationAlerts(String alertArray)
    {
        List<LocationAlert> alerts = new ArrayList<LocationAlert>();
        try {
            JSONArray alertArrayJson = new JSONArray(alertArray);
            for(int i=0; i<alertArrayJson.length(); i++)
            {
                JSONObject alertJson = alertArrayJson.getJSONObject(i) ;
                LocationAlert alert  = new LocationAlert();
                alert.fromJSONObj(alertJson, "");
                alerts.add(alert);
            }
        } catch (JSONException e) {
            return null;
        }
        return alerts;
    }

    @Override
    public void fromJSON(String jsonString, String type) {
        try {
            JSONObject jsonObj = new JSONObject(jsonString);
            fromJSONObj(jsonObj, type);
        } catch (JSONException e) {

        }
    }

    @Override
    public void fromJSONObj(JSONObject jsonObj, String type) {
        try {
            JSONObject place = jsonObj.optJSONObject("place");
            if(place!=null)
            {
                setId(place.getInt("id"));
                setLocationId(place.getInt("locationId"));
                setLocationGroupId(place.getInt("locationGroupId"));
                setAddress(place.getString("address"));
                setLatitude(place.getDouble("latitude"));
                setLongitude(place.getDouble("longitude"));
            }

        } catch (JSONException e) {

        }
    }

    @Override
    public String toJSON() {
        JSONObject jsonObj = toJSONObj();
        return jsonObj==null?"":jsonObj.toString();
    }

    public JSONObject toJSONObj()
    {
        JSONObject jsonObj = new JSONObject();
        try {
            jsonObj.put("id", id);
            jsonObj.put("locationId", locationId);
            jsonObj.put("locationGroupId", locationGroupId);
            jsonObj.put("address", address);
            jsonObj.put("latitude", latitude);
            jsonObj.put("longitude", longitude);

        } catch (JSONException e) {
            return null;
        }
        return jsonObj;
    }

    /**
     *
     * @return
     */
    public String getUniqueKeyForAlert(long surveyid)
    {
        String uniqueKeyForAlert = "LocId_" + getLocationId() + "LocSurveyId_" + surveyid;
        return uniqueKeyForAlert;
    }

    public void setId(int id) {this.id = id;}

    public int getId() {
        return id;
    }

    public void setLatitude(double lat) {
        this.latitude = lat;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLongitude(double _long) {
        this.longitude = _long;
    }

    public double getLongitude() {
        return longitude;
    }
    public int getLocationId() {
        return locationId;
    }
    public void setLocationId(int locationId) {
        this.locationId = locationId;
    }
    public int getLocationGroupId() {
        return locationGroupId;
    }
    public void setLocationGroupId(int locationGroupId) {
        this.locationGroupId = locationGroupId;
    }
    public String getAddress() {
        return address;
    }
    public void setAddress(String address) {
        this.address = address;
    }
}
