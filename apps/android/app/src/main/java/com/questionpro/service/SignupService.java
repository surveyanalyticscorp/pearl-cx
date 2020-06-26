package com.questionpro.service;

import android.content.Context;

import com.alibaba.fastjson.JSONObject;
import com.questionpro.whitelabelapps.R;
import com.questionpro.exception.NoConnectivityException;
import com.questionpro.model.AppUser;
import com.questionpro.network.ServerDataConnector;
import com.questionpro.request.SignupRequest;
import com.questionpro.response.SignupResponse;
import com.questionpro.utils.NetworkUtil;
import com.questionpro.utils.StringUtil;

/**
 * Created by sachinsable on 10/3/17.
 */

public class SignupService {
    public static String doSignup(AppUser appUser, Context context) throws Exception {
        if(NetworkUtil.getConnectivityStatus(context) == NetworkUtil.TYPE_NOT_CONNECTED){
            throw new NoConnectivityException();
        }
        appUser.baseURL =  context.getString(R.string.base_url);
        if(StringUtil.isNotEmpty(appUser.companyOrCommunityCode) && context.getResources().getBoolean(R.bool.use_global_login)){
            appUser.baseURL = GlobalPanelAuthService
                    .doPanelAuth(appUser.companyOrCommunityCode, context);
        }
        SignupRequest signupRequest = new SignupRequest(appUser);
        JSONObject requestJSON = signupRequest.buildRequestJSON();
        boolean hasApiKey = context.getResources().getBoolean(R.bool.has_api_key);
        if(hasApiKey){
            requestJSON.put("apiKey", context.getResources().getString(R.string.api_key));
        }
        String signupURL = appUser.baseURL + context.getString(R.string.signup_url);

        JSONObject responseText = ServerDataConnector.getInstance()
                .postJSONRequest(signupURL, requestJSON.toString());
        requestJSON.put("BASE_URL",appUser.baseURL );
        SignupResponse signupResponse = new SignupResponse(requestJSON);
        return signupResponse.parseResponse(responseText);
    }
}
