package com.questionpro.service;

import android.content.Context;

import com.alibaba.fastjson.JSONObject;
import com.questionpro.whitelabelapps.R;
import com.questionpro.app.CoreApplication;
import com.questionpro.model.AppUser;
import com.questionpro.network.ServerDataConnector;
import com.questionpro.response.LocationSurveysResponse;

public class LocationDatabaseUpdateService {
    private Context context;
    public LocationDatabaseUpdateService(Context context){
        this.context = context;
    }

    public String fetchLocationData(){
        String authToken =  AppUser.loadFromContext(CoreApplication.getContext()).authToken;
        String url = context.getResources().getString(R.string.base_url)
                + context.getResources().getString(R.string.location_survey_data_url);
        try {
            JSONObject jsonObject = ServerDataConnector.getInstance().getJSONRequest(url,authToken);
            LocationSurveysResponse locationSurveysResponse = new LocationSurveysResponse();
            return locationSurveysResponse.parseResponse(jsonObject);
        }
        catch (Exception e){
            e.printStackTrace();
            return null;
        }
    }
}
