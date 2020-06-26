package com.questionpro.request;

import com.alibaba.fastjson.JSONObject;

/**
 * Created by sachinsable on 16/12/16.
 */

public class VerifyOTPRequest extends BaseRequest {
    private String emailAddresss, companyCode;
    private long OTP;
    public VerifyOTPRequest(String emailAddress, String companyCode, long OTP){
        this.emailAddresss = emailAddress;
        this.companyCode = companyCode;
        this.OTP = OTP;
    }
    @Override
    public JSONObject buildRequestJSON() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("emailAddress", this.emailAddresss);
        jsonObject.put("accessCode", this.companyCode);
        jsonObject.put("otp", this.OTP);
        return  jsonObject;
    }

}
