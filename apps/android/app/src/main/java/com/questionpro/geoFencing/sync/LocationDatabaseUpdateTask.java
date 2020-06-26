package com.questionpro.geoFencing.sync;

import android.content.Context;
import android.os.AsyncTask;
import android.preference.PreferenceManager;
import android.util.Log;

import com.alibaba.fastjson.JSONObject;
import com.questionpro.app.CoreApplication;
import com.questionpro.model.AppUser;
import com.questionpro.network.ServerDataConnector;
import com.questionpro.service.LocationDatabaseUpdateService;
import com.questionpro.utils.StringUtil;

public class LocationDatabaseUpdateTask extends AsyncTask {
    private Context context;
    private final String TAG = "LocationDBUpdateTask";
    private QPLocationResultUploadTask.ResultCallback resultCallback;
    public LocationDatabaseUpdateTask(Context context, QPLocationResultUploadTask.ResultCallback resultCallback){
        this.context = context;
        this.resultCallback = resultCallback;
    }
    @Override
    protected Object doInBackground(Object[] objects) {
        String databaseLocation = AppUser.getLocationSurveyDBLocation(context);
        try {
            LocationDatabaseUpdateService locationDatabaseUpdateService
                    = new LocationDatabaseUpdateService(context);
            String response =  locationDatabaseUpdateService.fetchLocationData();
            if(null != response) {
                JSONObject responseJSON = JSONObject.parseObject(response);
                String version = responseJSON.getLong("locationSurveyDBTimestamp")+"";
                String databaseURL = responseJSON.getString("surveyDBFile");
                if (!version.equals(getSavedDatabaseVersion())) {
                    Log.i(TAG, "Version mismatch. So updating database");
                    if(StringUtil.isEmpty(databaseLocation)){
                        Log.i(TAG, "New DB location initialization for first time.");
                        databaseLocation = CoreApplication.getContext().getFilesDir().getAbsolutePath() +
                                "/LocationSurvey.sqlite";
                    }
                    Log.i(TAG, "downloading database");
                    ServerDataConnector.getInstance().downloadAndSaveFile(databaseURL,databaseLocation);
                    setSavedDatabaseVersion(version);
                    Log.i(TAG, "Database downloaded. Returning location.");
                }
                return databaseLocation;
            }
            return null;

        }
        catch (Exception e){
            e.printStackTrace();
            return e;
        }
    }

    @Override
    protected void onPostExecute(Object object) {
        if(null == object || object instanceof Throwable){
            resultCallback.onFailure(object);
        }
        else if(object instanceof String) { // Success is string
            resultCallback.onSuccess(object);
        }
    }

    private String getSavedDatabaseVersion(){
       return PreferenceManager.getDefaultSharedPreferences(context)
                .getString("SURVEY_DB_MODIFIED_TIME", "");
    }

    private void setSavedDatabaseVersion(String version){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .putString("SURVEY_DB_MODIFIED_TIME", version).apply();
    }


}
