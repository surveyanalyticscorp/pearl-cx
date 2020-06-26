package com.questionpro.service;

import android.content.Context;

import com.alibaba.fastjson.JSONObject;
import com.questionpro.whitelabelapps.R;
import com.questionpro.exception.NoConnectivityException;
import com.questionpro.model.AppUser;
import com.questionpro.network.ServerDataConnector;
import com.questionpro.request.LoginRequest;
import com.questionpro.response.LoginResponse;
import com.questionpro.utils.NetworkUtil;
import com.questionpro.utils.StringUtil;
import com.questionpro.utils.Utils;

/**
 * Created by sachinsable on 25/08/16.
 */

public class LoginService {

    public static void doLogin(AppUser appUser,Context context) throws Exception {
        if(NetworkUtil.getConnectivityStatus(context) == NetworkUtil.TYPE_NOT_CONNECTED){
            throw new NoConnectivityException();
        }
        appUser.baseURL =  context.getString(R.string.base_url);
        if(StringUtil.isNotEmpty(appUser.companyOrCommunityCode) && context.getResources().getBoolean(R.bool.use_global_login)){
            appUser.baseURL = GlobalPanelAuthService
                    .doPanelAuth(appUser.companyOrCommunityCode, context);
        }
        LoginRequest loginRequest = new LoginRequest(appUser);
        JSONObject requestJSON = loginRequest.buildRequestJSON();
        requestJSON.put("udId", Utils.getUniqueDeviceId(context));
        boolean hasApiKey = context.getResources().getBoolean(R.bool.has_api_key);
        if(hasApiKey){
            requestJSON.put("apiKey", context.getResources().getString(R.string.api_key));
        }
        String loginURL = appUser.baseURL + context.getString(R.string.auth_url);

        JSONObject responseText = ServerDataConnector.getInstance()
                .postJSONRequest(loginURL, requestJSON.toString());
        requestJSON.put("BASE_URL",appUser.baseURL );
        LoginResponse loginResponse = new LoginResponse(requestJSON);
        loginResponse.parseResponse(responseText);
    }
}
