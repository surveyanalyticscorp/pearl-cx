package com.questionpro.response;

import com.alibaba.fastjson.JSONObject;
import com.questionpro.exception.QPException;

/**
 * Created by sachinsable on 2/9/18.
 */

public class LocationResultResponse extends BaseResponse {
    @Override
    public String parseResponse(JSONObject response) throws QPException {
        if(response != null && response.containsKey("statusCode")){
            int code = response.getInteger("statusCode");
            if(code == 200){
                return "success";
            }
        }
        return null;
    }
}
