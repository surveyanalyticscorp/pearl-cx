package com.questionpro.request;

import com.alibaba.fastjson.JSONObject;

/**
 * Created by sachinsable on 20/03/17.
 */

public class GlobalPanelAuthRequest extends BaseRequest {
    private String accessCode;
    public GlobalPanelAuthRequest(String accessCode){
        this.accessCode = accessCode;
    }
    @Override
    public JSONObject buildRequestJSON() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("accessCode", this.accessCode);
        return jsonObject;
    }
}
