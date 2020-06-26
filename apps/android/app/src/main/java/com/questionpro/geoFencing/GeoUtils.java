/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package com.questionpro.geoFencing;


import android.app.Activity;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.location.Location;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.preference.PreferenceManager;
import android.util.Log;

import androidx.core.app.NotificationCompat;
import androidx.core.app.TaskStackBuilder;
import androidx.core.content.FileProvider;

import com.questionpro.home.ReactHomeActivity;
import com.questionpro.utils.Utils;
import com.questionpro.whitelabelapps.R;
import com.questionpro.geoFencing.database.LocationResponseDBHelper;
import com.questionpro.geoFencing.model.QPLocation;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.channels.FileChannel;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

/**
 * Utility methods used in this sample.
 */
public class GeoUtils {

    final static String KEY_LOCATION_UPDATES_REQUESTED = "location-updates-requested";
    final static String KEY_LOCATION_INSIDE_FENCE_UPDATES_REQUESTED = "location-inside-fence-updates-requested";
    final static String KEY_INSIDE_FENCE_LOCATION_UPDATES_REQUESTED = "inside-fence-location-updates-requested";

    final static String KEY_LOCATION_INSIDE_POLYGON_FLAG = "location-inside-polgon-flag";
    final static String KEY_LOCATION_UPDATES_RESULT = "location-update-result";
    final static String KEY_GEOFENCE = "geofence-added";
    final static String KEY_BATTER_PERCENTAGE = "battery-percentage";
    final static String CHANNEL_ID = "channel_01";
    final static String RESULT_FILE_NAME = "LocationTrackingResult.txt";
    final static String FULL_LOG_FILE_NAME = "FullTrackingLog.txt";
    final static String DELIMITER = "-";
    final public static String LOCATION_SETTING_ACTION = "com.questionpro.location_settings";
    final public static int LOCATION_SETTING_NOTIFICATION_ID = 99;
    final static String POLYGON_UNIQUE_KEY = "polygon-key";
    public static void setUniqueKeyForLocationAlert(Context context, String key) {
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .putBoolean(key, true)
                .apply();
    }
    public static boolean getUniqueKeyForLocationAlert(Context context, String key) {
        return PreferenceManager.getDefaultSharedPreferences(context)
                .getBoolean(key, false);

    }

    public static void setRequestingLocationUpdates(Context context, boolean value) {
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .putBoolean(KEY_LOCATION_UPDATES_REQUESTED, value)
                .apply();
    }

    public static void setRequestingLocationInsideFenceUpdates(Context context, boolean value){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .putBoolean(KEY_LOCATION_INSIDE_FENCE_UPDATES_REQUESTED, value)
                .apply();
    }

    public static void setRequestingInsideFenceLocationUpdatesForLocation(Context context, long locationID){
        Set<String> locations = getCurrentLocationsForInsideFenceUpdates(context);
        if(locations == null){
            locations = new HashSet<>();
        }
        if(!locations.contains(locationID+"")){
            locations.add(locationID+"");
        }
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .putStringSet(KEY_INSIDE_FENCE_LOCATION_UPDATES_REQUESTED, locations)
                .apply();
    }

    public static Set<String> getCurrentLocationsForInsideFenceUpdates(Context context){
        return PreferenceManager.getDefaultSharedPreferences(context)
                .getStringSet(KEY_INSIDE_FENCE_LOCATION_UPDATES_REQUESTED, null);
    }

    public static void deleteLocationForFenceUpdate(Context context, long storeID){
        Set<String> locations = getCurrentLocationsForInsideFenceUpdates(context);
        if(locations == null){
            locations = new HashSet<>();
        }
        if(locations.contains(storeID+"")){
            locations.remove(storeID+"");
        }
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .putStringSet(KEY_INSIDE_FENCE_LOCATION_UPDATES_REQUESTED, locations)
                .apply();
    }

    public static boolean isInsideFenceForLocation(Context context, long locationID){
        Set<String> locations = getCurrentLocationsForInsideFenceUpdates(context);
        return (locations!=null && locations.contains(""+locationID));
    }

    public static void setPolygonStartTime(Context context, long storeID, long time){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .putLong(storeID+"", time)
                .apply();
    }

    public static long getPolygonStartTime(Context context, long storeID){
        return PreferenceManager.getDefaultSharedPreferences(context)
                .getLong(storeID+"", 0);
    }

    public static void deletePolygonStartTime(Context context, long storeID){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .remove(storeID+"")
                .apply();
    }

    public static void setFenceStartTime(Context context, long storeID, long time){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .putLong(storeID+"-Fence", time)
                .apply();
    }

    public static long getFenceStartTime(Context context, long storeID){
        return PreferenceManager.getDefaultSharedPreferences(context)
                .getLong(storeID+"-Fence", 0);
    }

    public static void deleteFenceStartTime(Context context, long storeID){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .remove(storeID+"-Fence")
                .apply();
    }


    public static void setInsidePolygon(Context context, long storeID, boolean value){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .putBoolean(""+storeID, value)
                .apply();
    }

    public static void setCurrentTrackingPolygonID(Context context, long storeID){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .putLong(KEY_LOCATION_INSIDE_POLYGON_FLAG,storeID)
                .apply();
    }

    public static long getCurrentTrackingPolygonID(Context context){
        return PreferenceManager.getDefaultSharedPreferences(context)
                .getLong(KEY_LOCATION_INSIDE_POLYGON_FLAG,0);

    }
    public static void clearCurrentTrackingPolygonID(Context context){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit().remove(KEY_LOCATION_INSIDE_POLYGON_FLAG).apply();

    }

    public static boolean isAlreadyInsidePolygon(Context context, long storeID){
        return PreferenceManager.getDefaultSharedPreferences(context)
                .getBoolean(""+storeID, false);
    }

    public static boolean getRequestingLocationUpdates(Context context) {
        return PreferenceManager.getDefaultSharedPreferences(context)
                .getBoolean(KEY_LOCATION_UPDATES_REQUESTED, false);
    }

    public static void addGeoFence(Context context, long id){
        Log.i("Sachin", "Adding Geofence for - "+ id);
        Set<String> ids = getGeoFences(context);
        if(ids == null){
            ids = new HashSet<>();
        }
        ids.add(id+"");
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit().putStringSet(KEY_GEOFENCE, ids).apply();
    }

    public static void setGeoFences(Context context, Set<String> ids){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit().putStringSet(KEY_GEOFENCE, ids).apply();

    }

    public static Set<String> getGeoFences(Context context){
        Set<String> geoFences  =PreferenceManager
                .getDefaultSharedPreferences(context).getStringSet(KEY_GEOFENCE, null);
        return geoFences;
    }



    public static boolean isGeoFenceAdded(Context context, long id){
        Set<String> geoFences = getGeoFences(context);
        if(null != geoFences) {
            boolean containsId = geoFences.contains(id + "");
            Log.i("Sachin", "Geofence is already added for - "+ id);
            return containsId;
        }
        Log.i("Sachin", "Geofence is not added for - "+ id);
        return false;

    }

    public static void removeAllGeoFences(Context context){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit().remove(KEY_GEOFENCE).apply();
    }

    public static void removeGeoFencesForIds(Context context, ArrayList<String> ids){
        for(String id: ids){
            removeGeoFence(context, id);
        }
    }
    public static boolean areGeoFencesAdded(Context context){
        Set<String> stringSet = getGeoFences(context);
        return (stringSet != null && stringSet.size() > 0);
    }
    public static void removeGeoFence(Context context, String id){
       Set<String> ids =getGeoFences(context);
        if(ids.contains(id)){
           ids.remove(id);
        }
        setGeoFences(context, ids);
    }
    /**
     * Posts a notification in the notification bar when a transition is detected.
     * If the user clicks the notification, control goes to the MainActivity.
     */
    public static void sendNotification(Context context, String notificationDetails, String title) {
        // Create an explicit content Intent that starts the main Activity.
        Intent notificationIntent = new Intent(context, ReactHomeActivity.class);

        notificationIntent.putExtra("from_notification", true);

        // Construct a task stack.
        TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);

        // Add the main Activity to the task stack as the parent.
        stackBuilder.addParentStack(ReactHomeActivity.class);

        // Push the content Intent onto the stack.
        stackBuilder.addNextIntent(notificationIntent);

        // Get a PendingIntent containing the entire back stack.
        PendingIntent notificationPendingIntent =
                stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);

        // Get a notification builder that's compatible with platform versions >= 4
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context);

        // Define the notification settings.
        builder.setSmallIcon(R.drawable.notification_appicon)
                // In a real app, you may want to use a library like Volley
                // to decode the Bitmap.
                .setLargeIcon(BitmapFactory.decodeResource(context.getResources(),
                        R.mipmap.ic_launcher))
                .setColor(Color.RED)
                .setContentTitle(title)
                .setContentText(notificationDetails)
                .setContentIntent(notificationPendingIntent);

        // Dismiss notification once the user touches it.
        builder.setAutoCancel(true);
        // Get an instance of the Notification manager
        NotificationManager mNotificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        // Android O requires a Notification Channel.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = context.getString(R.string.app_name);
            // Create the channel for the notification
            NotificationChannel mChannel =
                    new NotificationChannel(CHANNEL_ID, name, NotificationManager.IMPORTANCE_DEFAULT);

            // Set the Notification Channel for the Notification Manager.
            mNotificationManager.createNotificationChannel(mChannel);

            // Channel ID
            builder.setChannelId(CHANNEL_ID);
        }

        // Issue the notification
        mNotificationManager.notify(0, builder.build());
    }

    public static void sendLocationSettingsNotification(Context context){


        NotificationCompat.Builder builder = new NotificationCompat.Builder(context);
        Intent locationSettingsIntent = new Intent();
        locationSettingsIntent.setAction(LOCATION_SETTING_ACTION);
        Bundle yesBundle = new Bundle();
        yesBundle.putInt("userAnswer", 1);//This is the value I want to pass
        locationSettingsIntent.putExtras(yesBundle);
        PendingIntent pendingIntentYes = PendingIntent.getBroadcast(context, 12345, locationSettingsIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        builder.addAction(0, "Turn On", pendingIntentYes);

        Intent cancelIntent = new Intent();

        locationSettingsIntent.setAction(LOCATION_SETTING_ACTION);
        Bundle noBundle = new Bundle();
        noBundle.putInt("userAnswer", -1);//This is the value I want to pass
        locationSettingsIntent.putExtras(noBundle);
        PendingIntent pendingIntentCancel = PendingIntent.getBroadcast(context, 12345, cancelIntent, PendingIntent.FLAG_UPDATE_CURRENT);
        builder.addAction(0, "Cancel", pendingIntentCancel);

        // Define the notification settings.
        builder.setSmallIcon(R.mipmap.ic_launcher)
                // In a real app, you may want to use a library like Volley
                // to decode the Bitmap.
                .setLargeIcon(BitmapFactory.decodeResource(context.getResources(),
                        R.mipmap.ic_launcher))
                .setColor(Color.RED)
                .setContentTitle("Location update")
                .setContentText("Location settings must be turned on for "+
                        context.getResources().getString(R.string.app_name) +" to work.");

        NotificationManager mNotificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        // Android O requires a Notification Channel.
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            CharSequence name = context.getString(R.string.app_name);
            // Create the channel for the notification
            NotificationChannel mChannel =
                    new NotificationChannel(CHANNEL_ID, name, NotificationManager.IMPORTANCE_DEFAULT);

            // Set the Notification Channel for the Notification Manager.
            mNotificationManager.createNotificationChannel(mChannel);

            // Channel ID
            builder.setChannelId(CHANNEL_ID);
        }

        // Issue the notification
        mNotificationManager.notify(LOCATION_SETTING_NOTIFICATION_ID, builder.build());


    }

    public static StoreModel findNearestGeofenceLocation(Location currentLocation, ArrayList<StoreModel> geoFences){
        StoreModel closestLocationStore = null;
        float smallestDistance = -1;

        for(StoreModel store:geoFences){
            float distance  = currentLocation.distanceTo(store.getLocation());
            if(smallestDistance == -1 || distance < smallestDistance) {
                closestLocationStore = store ;
                smallestDistance = distance;
            }
        }
        return closestLocationStore;
    }

    public static void writeFilesOnSdCard(Context context, String stringBody, boolean isFullLog) {
        File f1= null,fDateFolder = null,txtfile = null;
        try
        {
            File sd = Environment.getExternalStorageDirectory();

            if (sd.canWrite()) {
                f1 = new File(sd, context.getString(R.string.app_name));
                if (!f1.exists()) {
                    f1.mkdirs();
                }
                Calendar calendar = Calendar.getInstance();
                String date = calendar.get(Calendar.YEAR) + "-"
                        + (calendar.get(Calendar.MONTH) + 1) + "-"
                        + calendar.get(Calendar.DAY_OF_MONTH);


                fDateFolder = new File(f1, date);
                if (!fDateFolder.exists()) {
                    fDateFolder.mkdirs();
                }

                txtfile = new File(fDateFolder, isFullLog? FULL_LOG_FILE_NAME: RESULT_FILE_NAME  );
                String appendDelimiter = ",\n";
                if(!txtfile.exists()){
                    txtfile.createNewFile();
                    appendDelimiter = "";
                }



                FileWriter textFileWriter = new FileWriter(txtfile, true);

                BufferedWriter out = new BufferedWriter(textFileWriter);
                // create the content string
                String contentString = appendDelimiter+ ""+ new String(stringBody);
                // write the updated content
                out.write(contentString);
                out.close();
            }
        }catch(IOException e){
            e.printStackTrace();
        }
    }


    public static QPLocation getStoreByID(long id, ArrayList<QPLocation> stores){
        return QPLocation.getQPLocationByID(id,stores);
    }



    public static void exportDatabase(Activity context, String appName) throws  IOException{
        String dstPath = Environment.getExternalStorageDirectory() + File.separator + appName + File.separator;
        File dst = new File(dstPath);
        File databaseFile = new File(LocationResponseDBHelper.getInstance(context).getReadableDatabase().getPath());
        File file = exportFile(databaseFile, dst);
        Uri uri = FileProvider.getUriForFile(context, context.getApplicationContext().getPackageName() + ".provider", file);
        Utils.sendEmail(context,uri, "Choose Email client","Attached is sqlite for Location Result");
    }
    public static  File exportFile(File src, File dst) throws IOException {

        //if folder does not exist
        if (!dst.exists()) {
            if (!dst.mkdir()) {
                return null;
            }
        }

        String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
        File expFile = new File(dst.getPath() + File.separator + "LocationResult" + timeStamp + ".sqlite");
        FileChannel inChannel = null;
        FileChannel outChannel = null;

        try {
            inChannel = new FileInputStream(src).getChannel();
            outChannel = new FileOutputStream(expFile).getChannel();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        try {
            inChannel.transferTo(0, inChannel.size(), outChannel);
        } finally {
            if (inChannel != null)
                inChannel.close();
            if (outChannel != null)
                outChannel.close();
        }

        return expFile;
    }


    public static void setPolygonUniqueKey(Context context, long key){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit().putLong(POLYGON_UNIQUE_KEY, key).apply();
    }

    public static long getPolygonUniqueKey(Context context){
        return PreferenceManager.getDefaultSharedPreferences(context)
                .getLong(POLYGON_UNIQUE_KEY, -1);
    }

    public static void clearPolygonUniqueKey(Context context){
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit().remove(POLYGON_UNIQUE_KEY).apply();
    }


}
