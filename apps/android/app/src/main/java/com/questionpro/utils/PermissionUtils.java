package com.questionpro.utils;

import android.Manifest;
import android.annotation.TargetApi;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;

import androidx.core.app.ActivityCompat;

import com.questionpro.whitelabelapps.R;

import java.util.ArrayList;

/**
 * Created by sachinsable on 29/03/17.
 */
@TargetApi(23)
public class PermissionUtils {
    public static final int INTERNET_PERMISSIONS_REQUEST = 1000;
    public static final int STORAGE_PERMISSIONS_REQUEST = 1001;
    public static final int LOCATION_PERMISSIONS_REQUEST = 1002;
    public static final int CAMERA_PERMISSIONS_REQUEST = 1003;
    public static final int RECORD_AUDIO_PERMISSIONS_REQUEST = 1004;
    public static final int PHONE_CALL_PERMISSIONS_REQUEST = 1005;
    public static final int READ_CONTACTS_PERMISSION_REQUEST = 1006;
    public static final int WRITE_CONTACTS_PERMISSION_REQUEST = 1007;
    public static final int ALL_PERMISSIONS_REQUEST = 1010;

    public static void checkExternalStoragePermissions(Activity activity) {
        String[] storagePermission = {
                Manifest.permission.WRITE_EXTERNAL_STORAGE,
                Manifest.permission.READ_EXTERNAL_STORAGE};
        int currentapiVersion = Build.VERSION.SDK_INT;
        if (currentapiVersion >= Build.VERSION_CODES.M) {
            activity.requestPermissions(storagePermission, STORAGE_PERMISSIONS_REQUEST);
        }
    }

    public static void checkInternetPermissions(Activity activity) {
        String[] internetPermission = {Manifest.permission.INTERNET};
        int currentapiVersion = Build.VERSION.SDK_INT;
        if (currentapiVersion >= Build.VERSION_CODES.M) {
            activity.requestPermissions(internetPermission, INTERNET_PERMISSIONS_REQUEST);
        }
    }

    /**
     *
     * @param activity
     */
    public static void checkLocationPermissions(Activity activity) {
        String[] locationPermission = {Manifest.permission.ACCESS_FINE_LOCATION};
        if(!PermissionUtils.checkPermissionGranted(activity,locationPermission[0])) {
            int currentApiVersion = Build.VERSION.SDK_INT;
            if (currentApiVersion >= Build.VERSION_CODES.M) {
                //activity.requestPermissions(locationPermission, LOCATION_PERMISSIONS_REQUEST);
                ActivityCompat.requestPermissions(activity, locationPermission, LOCATION_PERMISSIONS_REQUEST);
            }
        }
    }

    public static void checkCameraPermissions(Activity activity) {
        String[] locationPermission = {Manifest.permission.CAMERA};
        int currentapiVersion = Build.VERSION.SDK_INT;
        if (currentapiVersion >= Build.VERSION_CODES.M) {
            activity.requestPermissions(locationPermission, CAMERA_PERMISSIONS_REQUEST);
        }
    }


    public static void checkContactsPermission(Activity activity) {
        String[] locationPermission = {Manifest.permission.READ_CONTACTS, Manifest.permission.WRITE_CONTACTS};
        int currentapiVersion = Build.VERSION.SDK_INT;
        if (currentapiVersion >= Build.VERSION_CODES.M) {
            activity.requestPermissions(locationPermission, READ_CONTACTS_PERMISSION_REQUEST);
        }
    }

    public static void checkRecordAudioPermissions(Activity activity) {
        String[] locationPermission = {Manifest.permission.RECORD_AUDIO};
        int currentapiVersion = Build.VERSION.SDK_INT;
        if (currentapiVersion >= Build.VERSION_CODES.M) {
            activity.requestPermissions(locationPermission, RECORD_AUDIO_PERMISSIONS_REQUEST);
        }
    }

    public static void checkCallPermission(Activity activity) {
        String[] locationPermission = {Manifest.permission.CALL_PHONE};
        int currentapiVersion = Build.VERSION.SDK_INT;
        if (currentapiVersion >= Build.VERSION_CODES.M) {
            activity.requestPermissions(locationPermission, PHONE_CALL_PERMISSIONS_REQUEST);
        }
    }

    public static void checkAllPermissions(Activity activity) {
        String[] permissions = activity.getResources().getStringArray(R.array.permissions);
        ArrayList<String> permissionsToCheck = new ArrayList<>();
        for(String permission : permissions){
            if(activity.checkSelfPermission(permission) != PackageManager.PERMISSION_GRANTED){
                permissionsToCheck.add(permission);
            }
        }

        if(permissionsToCheck.size() == 0){
            return;
        }
        int currentapiVersion = Build.VERSION.SDK_INT;
        if (currentapiVersion >= Build.VERSION_CODES.M) {
            activity.requestPermissions(permissionsToCheck.toArray(new String[]{}), ALL_PERMISSIONS_REQUEST);
        }
    }


    /**
     *
     * @param context
     * @param permission
     * @return
     */
    public static boolean checkPermissionGranted(Context context,String permission) {
        //String permission = "android.permission.ACCESS_FINE_LOCATION";
        return (context.checkCallingOrSelfPermission(permission) == PackageManager.PERMISSION_GRANTED);

    }

}
