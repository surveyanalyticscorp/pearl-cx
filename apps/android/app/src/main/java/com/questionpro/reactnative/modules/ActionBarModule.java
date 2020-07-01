package com.questionpro.reactnative.modules;

import android.app.Activity;
import android.util.Log;

import com.alibaba.fastjson.JSONObject;
import com.questionpro.app.CoreApplication;
import com.questionpro.home.ReactHomeActivity;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by anishbhanwala on 13/09/16.
 */
public class ActionBarModule extends ReactContextBaseJavaModule {

    public ActionBarModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "ActionBarModule";
    }

    @ReactMethod
    public void updateTitleAndMenu(final String actionBarJsonString) {
        Log.i("Sachin", "UpdateTitleAndMenu" + actionBarJsonString);
        final ReactHomeActivity activity = (ReactHomeActivity) getCurrentActivity();
        if (activity != null) {
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    JSONObject jsonObject = JSONObject.parseObject(actionBarJsonString);
                    if(jsonObject!=null && (jsonObject.containsKey("title") || jsonObject.containsKey("contextMenu")|| jsonObject.containsKey("image"))) {
                        activity.updateActionBar(actionBarJsonString);
                    }
                }
            });
        }
    }

    @ReactMethod
    public void toggleBackButton(final boolean showBackButton){
        Log.i("Sachin", "ToggleBackButtonCalled>"+ showBackButton);
        final Activity activity = getCurrentActivity();

            if (activity != null) {
            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    ((ReactHomeActivity)activity).showBackButton(showBackButton);
                }
            });
        }
    }

    @ReactMethod
    public void updateLanguageMenuTitle(final String languageName){
        CoreApplication.changePreferredLanguage(getCurrentActivity(), languageName);
    }
}
