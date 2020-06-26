package com.questionpro.response;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.questionpro.app.CoreApplication;
import com.questionpro.exception.InvalidCompanyCodeException;
import com.questionpro.exception.InvalidEmailPasswordException;
import com.questionpro.exception.QPException;
import com.questionpro.model.AppUser;
import com.questionpro.utils.StringUtil;

/**
 * Created by sachinsable on 22/08/16.
 */

public class LoginResponse extends BaseResponse {
    public String authToken;
    private JSONObject requestJSON;
    public LoginResponse(JSONObject requestJSON){
        super();
        this.requestJSON = requestJSON;
    }
    @Override
    public String parseResponse(JSONObject response) throws QPException {


        if (response.containsKey("validationErrors")) {
            JSONArray array = response.getJSONArray("validationErrors");
            StringBuilder message = new StringBuilder("");
            if (array.size() > 0) {
                for (int i = 0; i < array.size(); i++) {
                    message.append(((JSONObject) array.get(i)).getString("error") + " <br>");
                }
                String message1 = message.substring(0, message.lastIndexOf("<br>"));
                throw new InvalidEmailPasswordException(message1.toString());
            }
        }
        String errorMessage = "";
        if (response.containsKey("errorAlert")) {
            errorMessage = response.getString("errorAlert");
        }
        if (StringUtil.isNotEmpty(errorMessage)) {
            if (errorMessage.contains("Invalid Email")) {
                throw new InvalidEmailPasswordException(errorMessage);
            } else if (errorMessage.contains("Invalid company code") || errorMessage.contains("Panel not found")) {
                throw new InvalidCompanyCodeException(errorMessage);
            } else {
                throw new QPException(errorMessage);
            }
        }

        //We got the success, so let's store the user details

        AppUser user = AppUser.fromJSONObj(response);
        user.emailAddress = requestJSON.getString("emailAddress");
        user.password = requestJSON.getString("password");
        if (requestJSON.containsKey("companyCode")) {
            user.companyOrCommunityCode = requestJSON.getString("companyCode");
        }
        if (response.containsKey("authToken")) {
            user.authToken = response.getString("authToken");
        }
        user.baseURL = requestJSON.getString("BASE_URL");
        AppUser.saveForContext(user, CoreApplication.getContext());
        return "Success";

    }

}
