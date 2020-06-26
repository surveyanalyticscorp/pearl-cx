package com.questionpro.geoFencing.model;


import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;

/**
 * Created by sachinsable on 1/23/18.
 */

public class QPLocationResult {
    public long id;
    public long locationGroupID;
    public long locationID;
    public String locationName;
    public long uniqueKey;
    public TrackType trackType;
    public TrackMovementType trackMovementType;
    public long timeStamp;
    public String batterPercentage;
    public QPLocationResult(){}

    public QPLocationResult(long locationGroupID, long locationID,
                            String locationName, TrackType trackType,
                            TrackMovementType trackMovementType, long timeStamp,
                            String batterPercentage, long uniqueKey) {
        this.locationGroupID = locationGroupID;
        this.locationID = locationID;
        this.locationName = locationName;
        this.trackType = trackType;
        this.trackMovementType = trackMovementType;
        this.timeStamp = timeStamp;
        this.batterPercentage = batterPercentage;
        this.uniqueKey = uniqueKey;
    }

    public enum TrackType{
        FENCE,
        POLYGON

    }

    public enum TrackMovementType{

        ENTRY,
        EXIT

    }


    public static JSONObject toJSON(QPLocationResult qpLocationResult) throws JSONException {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("ID", qpLocationResult.id);
        jsonObject.put("locationGroupID", qpLocationResult.locationGroupID);
        jsonObject.put("locationID", qpLocationResult.locationID);
        jsonObject.put("locationName", qpLocationResult.locationName);
        jsonObject.put("trackType", qpLocationResult.trackType.name());
        jsonObject.put("trackMovementType", qpLocationResult.trackMovementType.name());
        jsonObject.put("batteryLevel", qpLocationResult.batterPercentage);
        jsonObject.put("timeStamp", qpLocationResult.timeStamp);
        jsonObject.put("os", "android");
        jsonObject.put("uniqueKey", qpLocationResult.uniqueKey);
        return  jsonObject;

    }

}
