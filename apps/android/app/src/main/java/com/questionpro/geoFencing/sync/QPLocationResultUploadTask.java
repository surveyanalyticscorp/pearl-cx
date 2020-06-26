package com.questionpro.geoFencing.sync;

import android.content.Context;
import android.os.AsyncTask;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.questionpro.geoFencing.database.LocationResponseDBHelper;
import com.questionpro.service.LocationResultUploadService;
import com.questionpro.geoFencing.model.QPLocationResult;

import java.util.ArrayList;

/**
 * Created by sachinsable on 2/9/18.
 */

public class QPLocationResultUploadTask extends AsyncTask {
    private Context mContext;

    public interface ResultCallback{
        void onSuccess(Object result);
        void onFailure(Object error);
    }
    private ResultCallback resultCallback;
    public QPLocationResultUploadTask(Context context){
        mContext = context;
    }

    public QPLocationResultUploadTask(Context context, ResultCallback resultCallback){
        mContext = context;
        this.resultCallback = resultCallback;
    }
    @Override
    protected Object doInBackground(Object[] objects) {
        try {
            JSONObject jsonObject = buildLocationResultAndSendToReactForUpload();
            LocationResultUploadService locationResultUploadService = new LocationResultUploadService(jsonObject);
            return locationResultUploadService.uploadResponses(mContext);
        }
        catch (Exception e){
            e.printStackTrace();
            return null;
        }

    }

    @Override
    protected void onPostExecute(Object object) {
        if (resultCallback != null) {
            if (null == object || object instanceof Throwable) {
                resultCallback.onFailure(object);
            } else if (object instanceof String) { // Success is string
                resultCallback.onSuccess(object);
            }
        }
    }

    private JSONObject buildLocationResultAndSendToReactForUpload() throws JSONException {
        ArrayList<QPLocationResult> qpLocationResults = LocationResponseDBHelper.getInstance(mContext).getAllLocationResults();
        JSONArray jsonArray = new JSONArray();
        for (QPLocationResult result: qpLocationResults){
            jsonArray.add(QPLocationResult.toJSON(result));
        }
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("locationTracks", jsonArray);
        return jsonObject;

    }
}
