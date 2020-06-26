package com.questionpro.geoFencing;

import android.content.Context;
import android.content.SharedPreferences;

import com.questionpro.service.JSONenabled;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by Dattatraya Kunde on 26/09/17.
 */

public class LocationGroups implements JSONenabled {

    int _id;
    int location_group_id;
    int panel_id;
    int survey_id_list;
    String name;
    int q_point;
    int radious;
    int timer;

    private static final String PREF_NAME_LOCATION_GROUP = "PrefLocationGroup";
    private static final String LOCATION_GROUP_PREFS_KEY = "LOCATION_GROUP_PREFS_KEY";
    //public static final String SURVEY_LOCATION_GROUP_ALERT = "SURVEY_LOCATION_GROUP_ALERT";
    private static List<LocationGroups> savedLocationsGroup = null;

    public LocationGroups() {

    }

    public int get_id() {
        return _id;
    }

    public void set_id(int _id) {
        this._id = _id;
    }

    public int getLocation_group_id() {
        return location_group_id;
    }


    public void setLocation_group_id(int location_group_id) {
        this.location_group_id = location_group_id;
    }

    public int getPanel_id() {
        return panel_id;
    }


    public void setPanel_id(int panel_id) {
        this.panel_id = panel_id;
    }


    public int getSurvey_id_list() {
        return survey_id_list;
    }


    public void setSurvey_id_list(int survey_id_list) {
        this.survey_id_list = survey_id_list;
    }


    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }

    public int getQ_point() {
        return q_point;
    }


    public void setQpoint(int q_point) {
        this.q_point = q_point;
    }


    public int getRadious() {
        return radious;
    }


    public void setRadious(int radious) {
        this.radious = radious;
    }

    public int getTimer() {
        return timer;
    }


    public void setTimer(int timer) {
        this.timer = timer;
    }

    @Override
    public void fromJSONObj(JSONObject jsonObj, String type) {
        try {
            if (jsonObj != null) {
                setLocation_group_id(jsonObj.getInt("ID"));
                setQpoint(jsonObj.getInt("qPoint"));
                setSurvey_id_list(jsonObj.getInt("surveys"));
                setName(jsonObj.getString("name"));
                setRadious(jsonObj.getInt("radius"));
                setTimer(jsonObj.getInt("timer"));
            }

        } catch (JSONException e) {

        }
    }

    @Override
    public void fromJSON(String jsonString, String type) {

    }

    @Override
    public String toJSON() {
        return null;
    }

    /**
     *
     * @param cntx
     * @return
     */
    static List<LocationGroups> getSavedLocationAlerts(Context cntx)
    {
        SharedPreferences prefs = cntx.getSharedPreferences(PREF_NAME_LOCATION_GROUP, Context.MODE_PRIVATE);
        if(savedLocationsGroup!=null)
        {
            return savedLocationsGroup;
        }
        else{
            String savedAlertsStr = prefs.getString(LOCATION_GROUP_PREFS_KEY, "");
            savedLocationsGroup = parseLocationGroups(savedAlertsStr);
        }

        if(savedLocationsGroup==null)
        {
            savedLocationsGroup = new ArrayList<LocationGroups>();
            clearSavedLocation(cntx);
        }
        return savedLocationsGroup;
    }

    /**
     *
     * @param cntx
     */
    synchronized static void clearSavedLocationg(Context cntx)
    {
        SharedPreferences prefs = cntx.getSharedPreferences(PREF_NAME_LOCATION_GROUP, Context.MODE_PRIVATE);
        savedLocationsGroup.clear();
        SharedPreferences.Editor edt =prefs.edit();
        edt.remove(LOCATION_GROUP_PREFS_KEY);
        edt.commit();
    }


    /**
     *
     * @param locationGroupArray
     * @return
     */
    static List<LocationGroups> parseLocationGroups(String locationGroupArray)
    {
        List<LocationGroups> locationGroups = new ArrayList<LocationGroups>();
        try {
            JSONArray groupArrayJson = new JSONArray(locationGroupArray);
            for(int i=0; i<groupArrayJson.length(); i++)
            {
                JSONObject groupJson = groupArrayJson.getJSONObject(i) ;
                LocationGroups locationGroup  = new LocationGroups();
                locationGroup.fromJSONObj(groupJson, "");
                locationGroups.add(locationGroup);
            }
        } catch (JSONException e) {
            return null;
        }
        return locationGroups;
    }

    /**
     *
     * @param cntx
     */
    synchronized static void clearSavedLocation(Context cntx)
    {
        SharedPreferences prefs = cntx.getSharedPreferences(PREF_NAME_LOCATION_GROUP, Context.MODE_PRIVATE);
        savedLocationsGroup.clear();
        SharedPreferences.Editor edt =prefs.edit();
        edt.remove(LOCATION_GROUP_PREFS_KEY);
        edt.commit();
    }

    /**
     *
     * @param cntx
     * @param group
     */
    synchronized public static void saveLocationsGroups(Context cntx, List<LocationGroups> group){
        List<LocationGroups> oldAlerts = getSavedLocationAlerts(cntx);
        oldAlerts.addAll(group);
        JSONArray groupJsonArray = new JSONArray();
        SharedPreferences prefs = cntx.getSharedPreferences(PREF_NAME_LOCATION_GROUP, Context.MODE_PRIVATE);
        for(LocationGroups locGroup : oldAlerts)
        {
            groupJsonArray.put(locGroup.toJSONObj());
        }
        SharedPreferences.Editor edt = prefs.edit();
        edt.putString(LOCATION_GROUP_PREFS_KEY, groupJsonArray.toString());
        edt.commit();
    }

    /**
     *
     * @return
     */
    public JSONObject toJSONObj()
    {
        JSONObject jsonObj = new JSONObject();
        try {
            jsonObj.put("ID", location_group_id);
            jsonObj.put("", panel_id);
            jsonObj.put("surveys", survey_id_list);
            jsonObj.put("name", name);
            jsonObj.put("qPoint", q_point);
            jsonObj.put("radius", radious);
            jsonObj.put("timer", timer);
        } catch (JSONException e) {
            return null;
        }
        return jsonObj;
    }
}
