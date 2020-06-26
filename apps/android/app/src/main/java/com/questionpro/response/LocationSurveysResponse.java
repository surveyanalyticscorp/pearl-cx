package com.questionpro.response;

import com.alibaba.fastjson.JSONObject;


public class LocationSurveysResponse extends BaseResponse {
    @Override
    public String parseResponse(JSONObject response) {
        if(response != null && response.containsKey("statusCode")){
            int code = response.getInteger("statusCode");
            if(code == 200){
                return response.getJSONObject("body").toJSONString();
                //return locationSurveyData.getLong("locationSurveyDBTimestamp")+"";
            }
        }
        return null;
    }
}
