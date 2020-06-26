package com.questionpro.request;

import com.alibaba.fastjson.JSONObject;
import com.questionpro.model.AppUser;
import com.questionpro.utils.StringUtil;

/**
 * Created by sachinsable on 22/08/16.
 */

public class LoginRequest extends BaseRequest {
    AppUser appUser;
    public LoginRequest(AppUser appUser){
        this.appUser = appUser;
    }
    @Override
    public JSONObject buildRequestJSON() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("emailAddress",appUser.emailAddress);
        jsonObject.put("password", appUser.password);
        jsonObject.put("platform", "android");
        if(StringUtil.isNotEmpty(appUser.companyOrCommunityCode)){
            jsonObject.put("accessCode", appUser.companyOrCommunityCode);
        }
        if(StringUtil.isNotEmpty(appUser.sourceMode)){
            jsonObject.put("sourceMode",appUser.sourceMode);
        }
        return jsonObject;
    }
}
