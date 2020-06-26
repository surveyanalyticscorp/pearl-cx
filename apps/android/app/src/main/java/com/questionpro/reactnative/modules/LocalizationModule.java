package com.questionpro.reactnative.modules;

import android.app.Activity;

import com.questionpro.app.CoreApplication;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by piyushgarg on 12/09/17.
 */

public class LocalizationModule extends ReactContextBaseJavaModule  {
    public LocalizationModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "LocalizationModule";
    }

    @ReactMethod
    public void updatePreferedLanguage(String language){
        final Activity activity = getCurrentActivity();
        if (activity != null) {
            CoreApplication.updateLanguage(CoreApplication.getContext(), language);

            activity.runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    activity.recreate();
                }
            });
        }
    }


}
