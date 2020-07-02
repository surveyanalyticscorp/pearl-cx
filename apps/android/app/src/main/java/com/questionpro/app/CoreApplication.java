package com.questionpro.app;

import android.app.ActivityManager;
import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.res.Configuration;
import android.os.Build;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;

import androidx.multidex.MultiDex;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.questionpro.pushnotification.QPGcmToken;
import com.questionpro.pushnotification.QPPushNotification;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.notification.INotificationsApplication;
import com.wix.reactnativenotifications.core.notification.IPushNotification;
import com.wix.reactnativenotifications.gcm.IGcmToken;
import com.wix.reactnativenotifications.gcm.INotificationsGcmApplication;
import com.oblador.vectoricons.VectorIconsPackage;
import com.yariksoffice.lingver.Lingver;

import java.io.File;
import java.util.Arrays;
import java.util.List;


/**
 * Created by sachinsable on 23/08/16.
 */

public class CoreApplication extends Application implements ReactApplication,INotificationsApplication, INotificationsGcmApplication {
    public static final String FORCE_LOCAL = "force_local";
    public static final String PREFERRED_LANGUAGE = "preferredLanguage";
    private static Context context = null;
    public void onCreate() {
        super.onCreate();
        context = getApplicationContext();
        String lan = getSavedLocaleLanguage();
        Log.i("Sachin", "Language - "+lan);
        Lingver.init(this, lan);

    }

    public static String getSavedLocaleLanguage(){
        SharedPreferences force_pref = PreferenceManager.getDefaultSharedPreferences(getContext());
        return force_pref.getString(FORCE_LOCAL, "");

    }

    public static Context getContext() {
        return context;
    }

    @Override
    protected void attachBaseContext(Context base) {
        super.attachBaseContext(base);
        MultiDex.install(this);
    }


    @Override
    public void onTerminate() {
        context = null;
        super.onTerminate();
    }
    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RNNotificationsPackage(CoreApplication.this),
                    new VectorIconsPackage()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public IPushNotification getPushNotification(Context context, Bundle bundle, AppLifecycleFacade facade, AppLaunchHelper defaultAppLaunchHelper) {
        return new QPPushNotification(context,bundle,facade,defaultAppLaunchHelper);
    }

    @Override
    public IGcmToken getGcmToken(Context context) {
        return new QPGcmToken(this);
    }

    public void clearApplicationData() {
        if (Build.VERSION_CODES.KITKAT <= Build.VERSION.SDK_INT) {
            ((ActivityManager)context.getSystemService(ACTIVITY_SERVICE))
                    .clearApplicationUserData(); // note: it has a return value!
        } else {
            File cacheDirectory = getCacheDir();
            File applicationDirectory = new File(cacheDirectory.getParent());
            if (applicationDirectory.exists()) {
                String[] fileNames = applicationDirectory.list();
                for (String fileName : fileNames) {
                    if (!fileName.equals("lib")) {
                        //deleteFile(new File(applicationDirectory, fileName));
                        deleteDir(new File(applicationDirectory,fileName));
                    }
                }
            }
        }
    }


    private boolean deleteDir(File dir) {
        if (dir != null && dir.isDirectory()) {
            String[] children = dir.list();
            for (int i = 0; i < children.length; i++) {
                boolean success = deleteDir(new File(dir, children[i]));
                if (!success) {
                    return false;
                }
            }
        }

        return dir.delete();
    }
    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        SharedPreferences force_pref = PreferenceManager.getDefaultSharedPreferences(getBaseContext().getApplicationContext());

        String language = force_pref.getString(FORCE_LOCAL, "en");
        updateLanguage(this, language);

    }



    /**
     *
     * @param ctx
     * @param lang
     */
    public static void updateLanguage(Context ctx, String lang) {
        SharedPreferences force_pref = PreferenceManager.getDefaultSharedPreferences(ctx);
        force_pref.edit().putString(FORCE_LOCAL, lang).apply();
        Lingver.getInstance().setLocale(ctx, lang);
    }

    public static void clearLanguagePreference(){
        updateLanguage(getContext(),"en");
    }



    /**
     *
     * @param ctx
     * @param lang
     */
    public static void changePreferredLanguage(Context ctx, String lang) {
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(ctx);
        preferences.edit().putString(PREFERRED_LANGUAGE, lang).apply();
        Lingver.getInstance().setLocale(ctx, lang);
    }

    public static String getPreferredLanguage(Context context){
        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(context);
        return preferences.getString(PREFERRED_LANGUAGE,"English");
    }
}
