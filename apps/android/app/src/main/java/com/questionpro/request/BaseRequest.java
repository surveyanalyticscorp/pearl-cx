package com.questionpro.request;

import com.alibaba.fastjson.JSONObject;

/**
 * Created by sachinsable on 22/08/16.
 */

public abstract class BaseRequest {
    abstract public JSONObject buildRequestJSON();
}
