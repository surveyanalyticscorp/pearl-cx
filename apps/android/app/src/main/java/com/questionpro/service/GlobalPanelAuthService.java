package com.questionpro.service;

import android.content.Context;

import com.alibaba.fastjson.JSONObject;
import com.questionpro.whitelabelapps.R;
import com.questionpro.exception.NoConnectivityException;
import com.questionpro.network.ServerDataConnector;
import com.questionpro.request.GlobalPanelAuthRequest;
import com.questionpro.response.GlobalPanelAuthResponse;
import com.questionpro.utils.NetworkUtil;

/**
 * Created by sachinsable on 20/03/17.
 */

public class GlobalPanelAuthService {

    public static String doPanelAuth(String accessCode, Context context) throws Exception{
        if(NetworkUtil.getConnectivityStatus(context) == NetworkUtil.TYPE_NOT_CONNECTED){
            throw new NoConnectivityException();
        }
        GlobalPanelAuthRequest panelAuthRequest = new GlobalPanelAuthRequest(accessCode);
        JSONObject requestJSON = panelAuthRequest.buildRequestJSON();
        String forgotPasswordURL = context.getString(R.string.base_url) + context.getString(R.string.global_panel_auth_url);
        JSONObject responseText = ServerDataConnector.getInstance().postJSONRequest(forgotPasswordURL, requestJSON.toString());
        GlobalPanelAuthResponse globalPanelAuthResponse = new GlobalPanelAuthResponse();
        return globalPanelAuthResponse.parseResponse(responseText);
    }
}
