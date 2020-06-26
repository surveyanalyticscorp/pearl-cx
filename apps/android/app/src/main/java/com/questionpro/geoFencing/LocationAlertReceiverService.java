package com.questionpro.geoFencing;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.location.LocationManager;
import android.os.Bundle;
import android.util.Log;

import com.questionpro.model.AppUser;
import com.questionpro.pushnotification.QPPushNotification;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacadeHolder;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by Dattatraya Kunde on 26/09/17.
 */

public class LocationAlertReceiverService extends IntentService {

    public static final String EXTRA_DISPLAY_VALUE = "EXTRA_DISPLAY_VALUE";
    public static final String EXTRA_LOCATION_ID = "EXTRA_LOCATION_ID";
    public static final String EXTRA_LOCATION_SURVEY_ID = "EXTRA_LOCATION_SURVEY_ID";
    public static final String EXTRA_LOCATION_GROUP_ID = "EXTRA_LOCATION_GROUP_ID";
    public static final String EXTRA_LOCATION_SURVEY_PANEL_MEMBER_ID="EXTRA_PANEL_MEMBER_ID";
    public static final String EXTRA_SURVEY_ID = "EXTRA_SURVEY_ID";
    private static final String METHOD_NAME = "surveyanalytics.surveyswipe.startLocationSurvey";

    public static final String PREF_NAME_STARTED_LOCATION_SURVEYS = "PREF_NAME_STARTED_LOCATION_SURVEYS";


    public LocationAlertReceiverService()
    {
        super("net.surveyswipe.android.service.LocationAlertReceiverService");
    }
    public LocationAlertReceiverService(String name) {
        super(name);
    }

    @Override
    protected void onHandleIntent(Intent intent) {
        boolean isEntering = intent.getBooleanExtra(LocationManager.KEY_PROXIMITY_ENTERING, false);
        //String type = intent.getStringExtra(EXTRA_TYPE);
        /*if(LocationAlert.SURVEY_LOCATION_ALERT.equals(type)){
            handleSurveyAlert(intent, isEntering);
        }
        else if(LocationAlert.ACC_LOCATION_ALERT.equals(type)){
            handleAccAlert(intent, isEntering);
        }*/
        handleSurveyAlert(intent, isEntering);
        Log.d("Datta", "on Handel Intent LocationAlertReceiverService- Entering-"+isEntering);
    }

    private void handleAccAlert(Intent intent, boolean isEntering) {
        if(isEntering){

        }
        else{

        }
    }

    @SuppressWarnings("deprecation")
    private void handleSurveyAlert(Intent intent, boolean isEntering) {
        if(isEntering)
        {
            int panelMemberId=intent.getIntExtra(EXTRA_LOCATION_SURVEY_PANEL_MEMBER_ID, 0);
            int locationGroupId=intent.getIntExtra(EXTRA_LOCATION_GROUP_ID, 0);
            int locationID = intent.getIntExtra(EXTRA_LOCATION_ID, 0);
            long surveyId = intent.getLongExtra(EXTRA_SURVEY_ID, 0);
            String displayValue = intent.getStringExtra(EXTRA_DISPLAY_VALUE);
            LocationAlert tempAlert= new LocationAlert();
            tempAlert.setLocationId(locationID);
            String uniqueKeyForAlert = tempAlert.getUniqueKeyForAlert(surveyId);
            Log.d("Datta", "Location based survey panel member ID:"+panelMemberId);
            SharedPreferences prefs = this.getSharedPreferences(PREF_NAME_STARTED_LOCATION_SURVEYS, Context.MODE_PRIVATE);
            Log.d("Datta", displayValue+ ": uniqueKeyForAlert is stored in pref: "+prefs.getBoolean(uniqueKeyForAlert, false));

            if(!prefs.getBoolean(uniqueKeyForAlert, false)) {
                AppUser appUser = AppUser.loadFromContext(this.getApplicationContext());
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
                        QPPushNotification qpPushNotification = new QPPushNotification(this, bundle, AppLifecycleFacadeHolder.get(), new AppLaunchHelper());
                        qpPushNotification.onPostRequest(null);

                        SharedPreferences.Editor edt = prefs.edit();
                        edt.putBoolean(uniqueKeyForAlert, true);
                        edt.commit();
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }

                }
            }
        }
    }


}
