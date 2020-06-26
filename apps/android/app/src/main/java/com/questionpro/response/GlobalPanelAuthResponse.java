package com.questionpro.response;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.questionpro.utils.StringUtil;
import com.questionpro.exception.InvalidCompanyCodeException;
import com.questionpro.exception.InvalidEmailPasswordException;
import com.questionpro.exception.QPException;

/**
 * Created by sachinsable on 20/03/17.
 */

public class GlobalPanelAuthResponse extends BaseResponse {
    @Override
    public String parseResponse(JSONObject response) throws QPException {
        if(response.containsKey("validationErrors")){
            JSONArray array = response.getJSONArray("validationErrors");
            StringBuilder message = new StringBuilder("");
            if(array.size()>0){
                for(int i=0; i<array.size();i++) {
                    message.append(((JSONObject) array.get(i)).getString("error") + " <br>");
                }
                String message1 = message.substring(0, message.lastIndexOf("<br>"));
                throw new InvalidEmailPasswordException(message1.toString());
            }
        }
        String errorMessage = "";
        if(response.containsKey("errorAlert")){
            errorMessage = response.getString("errorAlert");
        }
        if(StringUtil.isNotEmpty(errorMessage)){
           if(errorMessage.contains("Invalid company code") || errorMessage.contains("Panel not found")){
                throw new InvalidCompanyCodeException(errorMessage);
            }
            else{
                throw new QPException(errorMessage);
            }
        }
        if(response.getInteger("statusCode")==200 && response.containsKey("body")){
            JSONObject body = response.getJSONObject("body");
            if(body.containsKey("mobileAPIURL")) {
                return body.getString("mobileAPIURL");
            }
        }
        return "Success";
    }
}
