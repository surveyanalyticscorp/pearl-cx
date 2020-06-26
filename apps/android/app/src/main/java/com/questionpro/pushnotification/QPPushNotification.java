package com.questionpro.pushnotification;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.res.Resources;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;

import com.questionpro.home.ReactHomeActivity;
import com.questionpro.model.AppUser;
import com.questionpro.whitelabelapps.R;
import com.wix.reactnativenotifications.core.AppLaunchHelper;
import com.wix.reactnativenotifications.core.AppLifecycleFacade;
import com.wix.reactnativenotifications.core.JsIOHelper;
import com.wix.reactnativenotifications.core.notification.PushNotification;
import com.wix.reactnativenotifications.core.notification.PushNotificationProps;

import org.json.JSONException;
import org.json.JSONObject;

/**
 * Created by sachinsable on 31/01/17.
 */

public class QPPushNotification extends PushNotification {
    private Bundle bundle;
    private Context context;
    final String CHANNEL_ID = "qp_default_channel";
    public QPPushNotification(Context context, Bundle bundle, AppLifecycleFacade appLifecycleFacade,
                              AppLaunchHelper appLaunchHelper) {

        super(context, bundle, appLifecycleFacade, appLaunchHelper, new JsIOHelper());
        this.context = context;
        this.bundle = bundle;

    }

    @Override
    public PushNotificationProps createProps(Bundle bundle) {
        this.bundle = bundle;
        return new QPPushNotificationProps(bundle);

    }

    @Override
    protected void postNotification(int id, Notification notification) {

        long userID = bundle.getLong("USER_ID");
        if (AppUser.loadFromContext(context.getApplicationContext())!=null &&
                userID == AppUser.loadFromContext(context.getApplicationContext()).ID) {
            String CHANNEL_ID = "qp_default_channel";
            final NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                CharSequence name = "qp_channel";
                String description = "QuestionPro Notifcation Channel";
                int importance = NotificationManager.IMPORTANCE_HIGH;
                NotificationChannel channel = new NotificationChannel(CHANNEL_ID, name, importance);
                channel.setDescription(description);
                channel.enableLights(true);
                channel.setLightColor(Color.RED);
                channel.enableVibration(true);
                channel.setVibrationPattern(new long[]{100, 200, 300, 400, 500, 400, 300, 200, 400});
                channel.setShowBadge(true);
                notificationManager.createNotificationChannel(channel);
            }
            notificationManager.notify(id, notification);
        }
    }

    @Override
    protected Notification.Builder getNotificationBuilder(PendingIntent intent) {
        final Resources resources = mContext.getResources();

        // First, get a builder initialized with defaults from the core class.
        final Notification.Builder builder = super.getNotificationBuilder(intent);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder.setChannelId("qp_default_channel");
        }

        // Set custom-action icon.
        builder.setContentTitle(resources.getString(R.string.app_name));
        builder.setSmallIcon(getNotificationIcon());
        builder.setLargeIcon(BitmapFactory.decodeResource(context.getResources(), R.mipmap.ic_launcher));
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            builder.setChannelId(CHANNEL_ID);
        }
        return builder;
    }
    private static int getNotificationIcon() {
        boolean useWhiteIcon = (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP);
        return useWhiteIcon ? R.drawable.notification_appicon : R.mipmap.ic_launcher;
    }

    @Override
    protected PendingIntent getCTAPendingIntent() {
        JSONObject object  = new JSONObject();
        try {
             object = new JSONObject(mNotificationProps.asBundle().getString("gcm.notification.message"));
        } catch (JSONException e) {
            e.printStackTrace();
        }
        final Intent cta = new Intent(mContext, ReactHomeActivity.class);
        String launchScreen = object.optString("launchScreen");
        if(launchScreen.isEmpty()){
            if(object.optInt("type") == 1) {
                launchScreen = "Surveys";
            }
        }
        cta.putExtra("launchScreen",launchScreen);
        PendingIntent pendingIntent = PendingIntent.getActivity(context,0,cta,PendingIntent.FLAG_UPDATE_CURRENT);
        return pendingIntent;

    }
}
