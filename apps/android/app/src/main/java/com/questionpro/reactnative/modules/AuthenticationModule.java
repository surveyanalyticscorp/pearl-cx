package com.questionpro.reactnative.modules;

import android.app.Activity;
import android.content.Intent;
import android.widget.Toast;

import com.questionpro.app.CoreApplication;
import com.questionpro.home.ReactHomeActivity;
import com.questionpro.login.LoginActivity;
import com.questionpro.model.AppUser;
import com.questionpro.service.LoginService;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

/**
 * Created by anishbhanwala on 12/09/16.
 */
public class AuthenticationModule extends ReactContextBaseJavaModule {
    private static final String AUTH_TOKEN_LABS_SURVEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vbGFicy5zdXJ2ZXlhbmFseXRpY3MuY29tLyIsInVpZCI6MTc4Nzk1MSwicGlkIjowLCJleHAiOjE0NzMxMzk2NDcsImlhdCI6MTQ3MjUzNDg0N30.T3uXsXxd6-TPv0CifvqLawBR1Sbey-XEio1FKGO1Q80";
    private static final String AUTH_TOKEN_DEV_SURVEY = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vZGV2LnN1cnZleWFuYWx5dGljcy5jb20vIiwidWlkIjo3OTEsInBpZCI6MCwiZXhwIjoxNDc0Mjc3OTQ5LCJpYXQiOjE0NzM2NzMxNDl9.MmYlKeOvI6pSmXWUIArfAPbf0yhPXmQSjZVVpCtvG64";
    private static final String AUTH_TOKEN_DEV_FLASHLET = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vZGV2LnN1cnZleWFuYWx5dGljcy5jb20vIiwidWlkIjozODY2MzUsInBpZCI6OTIzLCJleHAiOjE0NzMzMzcxOTAsImlhdCI6MTQ3MjczMjM5MH0.3DGxfVog3pb_iRvfexaBwyksRZ06jmRRLmzVe4qEEoU";

    public AuthenticationModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "AuthenticationModule";
    }

    @ReactMethod
    public void getAuthToken(Callback successCallback, Callback errorCallback) {
        AppUser appUser = AppUser.loadFromContext(CoreApplication.getContext());
        //Log.i("Sachin", "Auth-token "+ appUser.authToken);
        if(appUser != null) {
            successCallback.invoke(appUser.authToken);
        }
        else{
            errorCallback.invoke("Error");
        }
    }

    @ReactMethod
    public void refreshAuthToken(Callback successCallback){
        AppUser appUser = AppUser.loadFromContext(CoreApplication.getContext());
        Activity activity = getCurrentActivity();
        if(appUser != null && activity != null) {
            final ReactHomeActivity reactHomeActivity = (ReactHomeActivity) activity;
            try {
                LoginService.doLogin(appUser, activity);
                successCallback.invoke(AppUser.loadFromContext(CoreApplication.getContext()).authToken);

            } catch (Exception e) {
                Toast.makeText(activity.getApplicationContext(), "Could not verify user, Please login again.", Toast.LENGTH_LONG).show();
                activity.runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        reactHomeActivity.finish();
                        reactHomeActivity.startActivity(new Intent(reactHomeActivity, LoginActivity.class));
                    }
                });
                e.printStackTrace();
            }
        }
    }

}