package com.questionpro.service;

import android.content.Context;
import android.util.Log;

import com.alibaba.fastjson.JSONObject;
import com.questionpro.whitelabelapps.R;
import com.questionpro.app.CoreApplication;
import com.questionpro.model.AppUser;
import com.questionpro.network.ServerDataConnector;
import com.questionpro.response.LocationResultResponse;


/**
 * Created by sachinsable on 2/9/18.
 */

public class LocationResultUploadService {
    private JSONObject dataJSON;
    public LocationResultUploadService(JSONObject dataJSON){
        this.dataJSON = dataJSON;
    }

    public String uploadResponses(Context context){
        String authToken =  AppUser.loadFromContext(CoreApplication.getContext()).authToken;
        String url = context.getResources().getString(R.string.base_url)
                + context.getResources().getString(R.string.upload_location_result_url);

        try {
            JSONObject jsonObject = ServerDataConnector.getInstance().postJSONRequest(url,
                    this.dataJSON.toString(), authToken);
            Log.i("Sachin", "Location Upload data: "+this.dataJSON.toString());
            LocationResultResponse locationResultResponse = new LocationResultResponse();
            return locationResultResponse.parseResponse(jsonObject);
        }
        catch (Exception e){
            e.printStackTrace();
            return null;
        }


    }

}
