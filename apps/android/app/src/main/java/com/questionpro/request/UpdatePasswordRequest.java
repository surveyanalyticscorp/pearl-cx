package com.questionpro.request;

import com.alibaba.fastjson.JSONObject;

/**
 * Created by sachinsable on 16/12/16.
 */

public class UpdatePasswordRequest extends BaseRequest {
    private String emailAddresss, companyCode, password;
    public UpdatePasswordRequest(String emailAddress, String companyCode, String password){
        this.emailAddresss = emailAddress;
        this.companyCode = companyCode;
        this.password = password;
    }
    @Override
    public JSONObject buildRequestJSON() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("emailAddress", this.emailAddresss);
        jsonObject.put("accessCode", this.companyCode);
        jsonObject.put("password", this.password);
        return  jsonObject;
    }
}
