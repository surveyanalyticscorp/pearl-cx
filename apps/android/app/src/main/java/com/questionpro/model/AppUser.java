package com.questionpro.model;

import android.content.Context;
import android.content.SharedPreferences;

import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;
import com.questionpro.utils.StringUtil;
import com.questionpro.utils.Utils;
import com.questionpro.geoFencing.LocationAlertReceiverService;

/**
 * Created by sachinsable on 18/08/16.
 */

public class AppUser {
    private final String TAG = "AppUser";
    public static final String USER_PREFERENCES_NAME = "qp_user_preferences";
    public long ID = 0;
    public long panelID = 0;
    public long parentMemberID = 0;
    public String emailAddress;
    public String subTitle;
    public String password;
    public String companyOrCommunityCode;
    public String authToken;
    public MainMenu mainMenu;
    public String firstName, lastName, organizationName;
    public String sourceMode;
    public String baseURL="";
    public boolean socialLoggedIn = false;

    private static String LOCATION_SURVEYS_DB_PATH="LocationSurveyDBLocation";
    private static String GEO_FENCING_STARTED="GeoFencingStarted";

    public AppUser(){}

    public AppUser(String emailAddress, String password){
        this.emailAddress = emailAddress;
        this.password = password;
    }
    public AppUser(String emailAddress, String password,String companyOrCommunityCode,String sourceMode){
        this.emailAddress = emailAddress;
        this.password = password;
        this.companyOrCommunityCode = companyOrCommunityCode;
        this.sourceMode=sourceMode;
    }

    public AppUser(String firstName, String lastName, String emailAddress, String password, String companyOrCommunityCode){
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = password;
        this.companyOrCommunityCode = companyOrCommunityCode;
    }
    public AppUser(String firstName, String lastName, String emailAddress, String password, boolean signup){
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailAddress = emailAddress;
        this.password = password;

    }

    /**
     *
     * @return
     */
    public JSONObject toJSONObj() {
        JSONObject json = new JSONObject();
        try {
            json.put("ID", ID);
            json.put("panelID", panelID);
            json.put("parentMemberID", parentMemberID);
            json.put("emailAddress", emailAddress);
            json.put("subTitle", subTitle);
            json.put("password", password);
            json.put("firstName", firstName);
            json.put("lastName", lastName);
            json.put("organizationName", organizationName);
            json.put("companyOrCommunityCode", companyOrCommunityCode);
            json.put("authToken", authToken);
            json.put("sourceMode",sourceMode);
            json.put("mainMenu", MainMenu.toJSON(mainMenu));
            json.put("baseURL", baseURL);
            json.put("socialLoggedIn", socialLoggedIn);

        } catch (JSONException jse) {
            Utils.printLog(TAG, "Error encoding JSON: " + jse.toString(), 'e');
        }
        return json;
    }


    /**
     *
     */
    public static AppUser fromJSONObj(JSONObject jsonObject) {

        AppUser appUser = new AppUser();

        appUser.emailAddress = jsonObject.getString("title");
        appUser.subTitle = jsonObject.getString("subtitle");
        appUser.authToken = jsonObject.getString("authToken");
        appUser.companyOrCommunityCode = jsonObject.getString("companyCode");
        appUser.mainMenu = MainMenu.fromJSON(jsonObject.getJSONObject("mainMenu"));
        if(jsonObject.containsKey("body")){

            JSONObject bodyJSON = jsonObject.getJSONObject("body");
            if(bodyJSON.containsKey("ID")){
                appUser.ID = bodyJSON.getLong("ID");
            }
            if(bodyJSON.containsKey("firstName")){
                appUser.firstName = bodyJSON.getString("firstName");
            }
            if(bodyJSON.containsKey("lastName")){
                appUser.lastName = bodyJSON.getString("lastName");
            }
            if(bodyJSON.containsKey("panelID")){
                appUser.panelID = bodyJSON.getLong("panelID");
            }
            if(bodyJSON.containsKey("parentMemberID")){
                appUser.parentMemberID = bodyJSON.getLong("parentMemberID");
            }

            if(bodyJSON.containsKey("organizationName")){
                appUser.organizationName = bodyJSON.getString("organizationName");
            }
        }
        return  appUser;

    }


    /**
     *
     * @param context
     * @return
     */
    public static AppUser loadFromContext(Context context){
        SharedPreferences pref = context.getSharedPreferences(USER_PREFERENCES_NAME, Context.MODE_PRIVATE);

        AppUser appUser = new AppUser();
        appUser.ID = pref.getLong("ID", 0);
        appUser.panelID = pref.getLong("panelID", 0);
        appUser.parentMemberID = pref.getLong("parentMemberID", 0);
        appUser.emailAddress = pref.getString("emailAddress", "");
        appUser.subTitle = pref.getString("subTitle", "");
        appUser.authToken = pref.getString("authToken","");
        if(StringUtil.isEmpty(appUser.authToken)){
            return null;
        }
        appUser.password = pref.getString("password","");
        appUser.sourceMode= pref.getString("sourceMode","");
        appUser.firstName = pref.getString("firstName","");
        appUser.lastName = pref.getString("lastName","");
        appUser.organizationName = pref.getString("organizationName","");
        appUser.companyOrCommunityCode = pref.getString("companyCode","");
        appUser.mainMenu = MainMenu.fromJSON(JSONObject.parseObject(pref.getString("mainMenu","{}")));
        appUser.baseURL = pref.getString("baseURL","");
        appUser.socialLoggedIn = pref.getBoolean("socialLoggedIn", false);

        return appUser;
    }

    public static void saveForContext(AppUser user, Context context){
        SharedPreferences pref = context.getSharedPreferences(USER_PREFERENCES_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = pref.edit();
        editor.putLong("ID", user.ID);
        editor.putLong("panelID", user.panelID);
        editor.putLong("parentMemberID", user.parentMemberID);
        editor.putString("emailAddress", user.emailAddress);
        editor.putString("password", user.password);
        editor.putString("sourceMode",user.sourceMode);
        editor.putString("firstName", user.firstName);
        editor.putString("lastName", user.lastName);
        editor.putString("organizationName", user.organizationName);
        editor.putString("subTitle", user.subTitle);
        editor.putString("companyCode", user.companyOrCommunityCode);
        editor.putString("authToken", user.authToken);
        editor.putString("mainMenu", MainMenu.toJSON(user.mainMenu).toString());
        editor.putString("baseURL", user.baseURL);
        editor.putBoolean("socialLoggedIn", user.socialLoggedIn);
        editor.commit();
    }

    public static String getUserEmailFromContext(Context context){
        SharedPreferences pref = context.getSharedPreferences(USER_PREFERENCES_NAME, Context.MODE_PRIVATE);
        return pref.getString("emailAddress","");
    }

    public static void setIsGeoFencingStarted(Context context,boolean value){
        SharedPreferences pref = context.getSharedPreferences(USER_PREFERENCES_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = pref.edit();
        editor.putBoolean(GEO_FENCING_STARTED, value);
        editor.commit();
    }

    public static boolean isGeoFencingStarted(Context context){
        SharedPreferences pref = context.getSharedPreferences(USER_PREFERENCES_NAME, Context.MODE_PRIVATE);
        return pref.getBoolean(GEO_FENCING_STARTED,false);
    }

    public static String getLocationSurveyDBLocation(Context context){
        SharedPreferences pref = context.getSharedPreferences(USER_PREFERENCES_NAME, Context.MODE_PRIVATE);
        return pref.getString(LOCATION_SURVEYS_DB_PATH,"");
    }

    public static void saveLocationSurveyDBLocation(Context context,String path){
        SharedPreferences pref = context.getSharedPreferences(USER_PREFERENCES_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = pref.edit();
        editor.putString(LOCATION_SURVEYS_DB_PATH, path);
        editor.commit();
    }




    public static void clearSavedUserData(Context context, boolean clearEmail){
        SharedPreferences pref = context.getSharedPreferences(USER_PREFERENCES_NAME, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor = pref.edit();
        editor.putLong("ID", 0);
        editor.putLong("panelID", 0);
        editor.putLong("parentMemberID", 0);
        editor.putString("authToken", "");
        editor.putString("password","");
        editor.putString("sourceMode","");
        editor.putString("subTitle","");
        editor.putString("companyCode", "");
        editor.putString("firstName", "");
        editor.putString("lastName", "");
        editor.putString("organizationName", "");
        editor.putString("baseURL","");
        editor.putBoolean("socialLoggedIn", false);
        editor.putBoolean("GeoFencingStarted",false);
        if(clearEmail){
            editor.putString("emailAddress","");
        }
        editor.commit();

        //Clear preferences for location based survey
        SharedPreferences prefs = context.getSharedPreferences(LocationAlertReceiverService.PREF_NAME_STARTED_LOCATION_SURVEYS, Context.MODE_PRIVATE);
        SharedPreferences.Editor editor1 = prefs.edit();
        editor1.clear();
        editor1.commit();
    }

    public static boolean isLoggedIn(Context context){
        return loadFromContext(context)!= null;
    }

}
