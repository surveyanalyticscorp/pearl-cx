package com.questionpro.request;

import com.alibaba.fastjson.JSONObject;

/**
 * Created by sachinsable on 05/12/16.
 */

public class ForgotPasswordRequest extends BaseRequest {
    private String emailAddresss, companyCode;
    public ForgotPasswordRequest(String emailAddress, String companyCode){
        this.emailAddresss = emailAddress;
        this.companyCode = companyCode;
    }
    @Override
    public JSONObject buildRequestJSON() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("emailAddress", this.emailAddresss);
        jsonObject.put("accessCode", this.companyCode);
        return  jsonObject;
    }
}
