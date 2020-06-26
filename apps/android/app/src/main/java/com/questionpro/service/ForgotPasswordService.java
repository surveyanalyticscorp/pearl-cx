package com.questionpro.service;

import android.content.Context;

import com.alibaba.fastjson.JSONObject;
import com.questionpro.whitelabelapps.R;
import com.questionpro.exception.NoConnectivityException;
import com.questionpro.network.ServerDataConnector;
import com.questionpro.request.ForgotPasswordRequest;
import com.questionpro.request.UpdatePasswordRequest;
import com.questionpro.request.VerifyOTPRequest;
import com.questionpro.response.ForgotPasswordResponse;
import com.questionpro.response.UpdatePasswordResponse;
import com.questionpro.response.VerifyOTPResponse;
import com.questionpro.utils.NetworkUtil;
import com.questionpro.utils.StringUtil;

/**
 * Created by sachinsable on 05/12/16.
 */

public class ForgotPasswordService {

    public static String forgotPassword(String emailAddress,String companyCode, Context context)  throws Exception {
        if(NetworkUtil.getConnectivityStatus(context) == NetworkUtil.TYPE_NOT_CONNECTED){
            throw new NoConnectivityException();
        }
        String baseURL =  context.getString(R.string.base_url);
        if(StringUtil.isNotEmpty(companyCode) && context.getResources().getBoolean(R.bool.use_global_login)){
            baseURL = GlobalPanelAuthService
                    .doPanelAuth(companyCode, context);
        }
        ForgotPasswordRequest forgotPasswordRequest = new ForgotPasswordRequest(emailAddress, companyCode);
        JSONObject requestJSON = forgotPasswordRequest.buildRequestJSON();
        boolean hasApiKey = context.getResources().getBoolean(R.bool.has_api_key);
        if(hasApiKey){
            requestJSON.put("apiKey", context.getResources().getString(R.string.api_key));
        }
        String forgotPasswordURL = baseURL + context.getString(R.string.forgot_password_url);
        JSONObject responseText = ServerDataConnector.getInstance().postJSONRequest(forgotPasswordURL, requestJSON.toString());
        ForgotPasswordResponse forgotPasswordResponse = new ForgotPasswordResponse();
        return forgotPasswordResponse.parseResponse(responseText);
    }

    public static String verifyOTP(String emailAddress, String companyCode, long OTP, Context context) throws Exception{
        if(NetworkUtil.getConnectivityStatus(context) == NetworkUtil.TYPE_NOT_CONNECTED){
            throw new NoConnectivityException();
        }
        String baseURL =  context.getString(R.string.base_url);
        if(StringUtil.isNotEmpty(companyCode) && context.getResources().getBoolean(R.bool.use_global_login)){
            baseURL = GlobalPanelAuthService
                    .doPanelAuth(companyCode, context);
        }
        VerifyOTPRequest verifyOTPRequest = new VerifyOTPRequest(emailAddress, companyCode,OTP);
        JSONObject requestJSON = verifyOTPRequest.buildRequestJSON();
        boolean hasApiKey = context.getResources().getBoolean(R.bool.has_api_key);
        if(hasApiKey){
            requestJSON.put("apiKey", context.getResources().getString(R.string.api_key));
        }
        String verifyOTPUrl = baseURL + context.getString(R.string.verify_otp_url);
        JSONObject responseText = ServerDataConnector.getInstance().postJSONRequest(verifyOTPUrl, requestJSON.toString());
        VerifyOTPResponse verifyOTPResponse = new VerifyOTPResponse();
        return verifyOTPResponse.parseResponse(responseText);
    }
    public static String updatePassword(String emailAddress, String companyCode, String password, Context context) throws Exception{
        if(NetworkUtil.getConnectivityStatus(context) == NetworkUtil.TYPE_NOT_CONNECTED){
            throw new NoConnectivityException();
        }
        String baseURL =  context.getString(R.string.base_url);
        if(StringUtil.isNotEmpty(companyCode) && context.getResources().getBoolean(R.bool.use_global_login)){
            baseURL = GlobalPanelAuthService
                    .doPanelAuth(companyCode, context);
        }
        UpdatePasswordRequest updatePasswordRequest = new UpdatePasswordRequest(emailAddress, companyCode,password);
        JSONObject requestJSON = updatePasswordRequest.buildRequestJSON();
        boolean hasApiKey = context.getResources().getBoolean(R.bool.has_api_key);
        if(hasApiKey){
            requestJSON.put("apiKey", context.getResources().getString(R.string.api_key));
        }
        String updatePasswordURL = baseURL + context.getString(R.string.update_password_url);
        JSONObject responseText = ServerDataConnector.getInstance().postJSONRequest(updatePasswordURL, requestJSON.toString());
        UpdatePasswordResponse updatePasswordResponse = new UpdatePasswordResponse();
        return updatePasswordResponse.parseResponse(responseText);
    }
}
