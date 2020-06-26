package com.questionpro.pushnotification;

import android.os.Bundle;
import android.util.Log;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.wix.reactnativenotifications.core.notification.PushNotificationProps;

/**
 * Created by sachinsable on 31/01/17.
 */

public class QPPushNotificationProps extends PushNotificationProps {

    public QPPushNotificationProps(Bundle bundle) {
        super(bundle);
        JSONObject message = JSON.parseObject(bundle.getString("gcm.notification.message"));
        if(message != null) {
            if (message.containsKey("message")) {
                int  type =  message.getIntValue("type");
                bundle.putString("title", getPushTitle(type));
                bundle.putInt("type", message.getIntValue("type"));
                bundle.putLong("USER_ID", message.getLongValue("memberID"));
                bundle.putString("body", message.getString("message"));
            }
        }
        else{
            Log.e("QPPushnotification", "Error in Push notification message format.");
        }




    }

    private String getPushTitle(int type){
        switch (type){
            case 1:
                return "Survey";
            case 2:
                return "Alert";
            case 3:
                return "Poll";
            default:
                return "Alert";
        }
    }

    @Override
    protected QPPushNotificationProps copy() {
        return new QPPushNotificationProps((Bundle) mBundle.clone());
    }
}
