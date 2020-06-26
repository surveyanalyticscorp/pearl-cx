package com.questionpro.request;

import com.alibaba.fastjson.JSONObject;
import com.questionpro.model.AppUser;
import com.questionpro.utils.StringUtil;

/**
 * Created by sachinsable on 10/3/17.
 */

public class SignupRequest extends BaseRequest {
    private AppUser appUser;
    public SignupRequest(AppUser appUser){
        this.appUser = appUser;
    }

    @Override
    public JSONObject buildRequestJSON() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("firstName", appUser.firstName);
        jsonObject.put("lastName", appUser.lastName);
        jsonObject.put("emailAddress",appUser.emailAddress);
        jsonObject.put("password", appUser.password);
        jsonObject.put("platform", "android");
        if(StringUtil.isNotEmpty(appUser.companyOrCommunityCode)){
            jsonObject.put("accessCode", appUser.companyOrCommunityCode);
        }
        return jsonObject;
    }
}
