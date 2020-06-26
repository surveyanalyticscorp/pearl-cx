package com.questionpro.geoFencing.database;

import android.content.Context;
import android.database.Cursor;
import android.util.Log;

import androidx.annotation.NonNull;

import com.google.android.gms.maps.model.LatLng;
import com.questionpro.geoFencing.model.QPLocation;
import com.questionpro.geoFencing.model.QPLocationGroup;
import com.questionpro.geoFencing.model.QPVertex;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Created by Dattatraya Kunde on 26/09/17.
 */

public class LocationDBManager {
    private static DBHelper dbHelper;

    /**
     *  @param context
     * @param latitude
     * @param longitude
     * @param radiusInFeet
     */
    public static ArrayList<QPLocation> getLocationsSurveyFromDB(Context context, double latitude, double longitude, double radiusInFeet) {

        ArrayList<QPLocation> qpLocations = new ArrayList<>();
        dbHelper = DBHelper.getInstance(context);
        LatLng center = new LatLng(latitude,longitude);
        final double  mult = 1.1; //is more reliable
        LatLng p1 = calculateDerivedPosition(center, mult * radiusInFeet, 0);
        LatLng p2 = calculateDerivedPosition(center, mult * radiusInFeet, 90);
        LatLng p3 = calculateDerivedPosition(center, mult * radiusInFeet, 180);
        LatLng p4 = calculateDerivedPosition(center, mult * radiusInFeet, 270);
        double fudge = Math.pow(Math.cos(Math.toRadians(latitude)),2);
        String strWhere =  " WHERE "
                + "latitude" + " > " + String.valueOf(p3.latitude) + " AND "
                + "latitude" + " < " + String.valueOf(p1.latitude) + " AND "
                + "longitude" + " < " + String.valueOf(p2.longitude) + " AND "
                + "longitude" + " > " + String.valueOf(p4.longitude);
        String orderBy = "(("+ latitude + " - latitude) * ("+latitude +"- latitude) +"+
            "("+longitude+" - longitude) * ("+ longitude + "- longitude) * "+fudge+")";
        Cursor cursor=null;

        String sqlQuey="select * from location " + strWhere + " order by "+orderBy + " limit 5";

        Log.i("Sachin", "Query-"+sqlQuey);

        try {
            cursor = dbHelper.dbRawQuery(sqlQuey);
            Log.i("Sachin", "Cursor Size- "+cursor.getCount());
            if(cursor.moveToFirst()) {
               do{
                   QPLocation qpLocation = getQPLocation(cursor);
                   qpLocations.add(qpLocation);

               } while (cursor.moveToNext());
            }
        } catch (Exception e) {e.printStackTrace();}
        finally {
            if(cursor!=null) {
                cursor.close();
            }
        }

        return qpLocations;
    }

    @NonNull
    private static QPLocation getQPLocation(Cursor cursor) {
        QPLocation qpLocation=new QPLocation();
        qpLocation.setId(cursor.getInt(cursor.getColumnIndex("_id")));
        qpLocation.setLocationID(cursor.getInt(cursor.getColumnIndex("location_id")));
        qpLocation.setLocationGroupID(cursor.getInt(cursor.getColumnIndex("location_group_id")));
        qpLocation.setAddress(cursor.getString(cursor.getColumnIndex("address")));
        qpLocation.setLatitude(cursor.getDouble(cursor.getColumnIndex("latitude")));
        qpLocation.setLongitude(cursor.getDouble(cursor.getColumnIndex("longitude")));
        return qpLocation;
    }


    /**
     * Get the maxx value of radius
     * @return
     */
    public static int getMaxRadiusFromLocationGroup(Context context)
    {
        dbHelper=DBHelper.getInstance(context);
        Cursor cursor=null;

        try {
            String sqlQuey="SELECT MAX(radius) FROM location_group";
            cursor = dbHelper.dbRawQuery(sqlQuey);
            if(cursor.moveToFirst())
            {
                return cursor.getInt(0);
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        catch(Error er){
            er.printStackTrace();
        }
        finally {
            if(cursor!=null) {
                cursor.close();
            }
        }
        return 0;
    }


    /**
     * This function is used to get the list of all location groups from Data base.
     * @param cntx
     * @return
     */
    public static ArrayList<QPLocationGroup> getAllLocationGroups(Context cntx)
    {
        ArrayList<QPLocationGroup> qpLocationGroups=new ArrayList<QPLocationGroup>();
        dbHelper=DBHelper.getInstance(cntx);
        Cursor cursor=null;
        String sqlQuey="select * from location_group";
        Log.d("Datta", "Select all Location groups Query :"+sqlQuey);

        try {
            cursor = dbHelper.dbRawQuery(sqlQuey);
            if(cursor.moveToFirst())
            {
                while (cursor.isAfterLast()==false)
                {
                    QPLocationGroup qpLocationGroup = getQpLocationGroup(cursor);

                    qpLocationGroups.add(qpLocationGroup);
                    cursor.moveToNext();
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            if(cursor!=null) {
                cursor.close();
            }
        }

        return qpLocationGroups;

    }
    public static Map<Long,QPLocationGroup> getAllLocationGroupsAsMap(Context cntx)
    {
        Map<Long,QPLocationGroup> qpLocationGroups=new LinkedHashMap<>();
        dbHelper=DBHelper.getInstance(cntx);
        Cursor cursor=null;
        String sqlQuey="select * from location_group";

        try {
            cursor = dbHelper.dbRawQuery(sqlQuey);
            if(cursor.moveToFirst())
            {
                while (!cursor.isAfterLast())
                {
                    QPLocationGroup qpLocationGroup = getQpLocationGroup(cursor);

                    qpLocationGroups.put(qpLocationGroup.getId(), qpLocationGroup);
                    cursor.moveToNext();
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }


        return qpLocationGroups;

    }

    @NonNull
    private static QPLocationGroup getQpLocationGroup(Cursor cursor) {
        QPLocationGroup qpLocationGroup=new QPLocationGroup();
        qpLocationGroup.setId(cursor.getInt(cursor.getColumnIndex("_id")));
        qpLocationGroup.setLocationGroupID(cursor.getInt(cursor.getColumnIndex("location_group_id")));
        qpLocationGroup.setPanelID(cursor.getInt(cursor.getColumnIndex("panel_id")));
        qpLocationGroup.setSurveyIDList(cursor.getString(cursor.getColumnIndex("survey_id_list")));
        qpLocationGroup.setName(cursor.getString(cursor.getColumnIndex("name")));
        qpLocationGroup.setqPoint(cursor.getInt(cursor.getColumnIndex("q_point")));
       // qpLocationGroup.setRadius(cursor.getInt(cursor.getColumnIndex("radius")));
        qpLocationGroup.setRadius(1000);
        qpLocationGroup.setDelayTime(cursor.getInt(cursor.getColumnIndex("timer")));
        return qpLocationGroup;
    }

    private static QPVertex getQPVertex(Cursor cursor){
        QPVertex qpVertex = new QPVertex();
        qpVertex.setId(cursor.getInt(cursor.getColumnIndex("_id")));
        qpVertex.setLocationID(cursor.getLong(cursor.getColumnIndex("location_id")));
        qpVertex.setLocationGroupID(cursor.getLong(cursor.getColumnIndex("location_group_id")));
        qpVertex.setLatitude(cursor.getDouble(cursor.getColumnIndex("latitude")));
        qpVertex.setLongitude(cursor.getDouble(cursor.getColumnIndex("longitude")));
        return qpVertex;
    }

    private static LatLng getLatLng(Cursor cursor){
        return new LatLng(cursor.getDouble(cursor.getColumnIndex("latitude")),
                cursor.getDouble(cursor.getColumnIndex("longitude")) );
    }

    public static QPLocationGroup getQPLocationGroupByID(Context context,long groupID){
        dbHelper=DBHelper.getInstance(context);
        Cursor cursor=null;
        String query = "select * from location_group where location_group_id = "+groupID+";";

        try {
            cursor = dbHelper.dbRawQuery(query);
            if(cursor.moveToFirst())
            {
                while (!cursor.isAfterLast())
                {
                    QPLocationGroup qpLocationGroup = getQpLocationGroup(cursor);
                    return qpLocationGroup;
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            if(cursor!=null) {
                cursor.close();
            }
        }
        return null;
    }


    public static QPLocation getQPLocationByID(Context context, long locationID){
        dbHelper=DBHelper.getInstance(context);
        Cursor cursor=null;
        String query = "select * from location where location_id = "+locationID+";";

        try {
            cursor = dbHelper.dbRawQuery(query);
            if(cursor.moveToFirst())
            {
                while (!cursor.isAfterLast())
                {
                   return getQPLocation(cursor);
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            if(cursor!=null) {
                cursor.close();
            }
        }
        return null;
    }

    public static List<QPVertex> getQPVerticesForLocation(Context context, long locationID){
        dbHelper = DBHelper.getInstance(context);
        Cursor cursor=null;
        String query = "select * from location_shape where location_id = "+locationID+";";

        List<QPVertex> qpVertices = new ArrayList<>();
        try {
            cursor = dbHelper.dbRawQuery(query);
            if(cursor.moveToFirst())
            {
                while (!cursor.isAfterLast())
                {
                    qpVertices.add(getQPVertex(cursor));
                }
            }
        }
        catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            if(cursor!=null) {
                cursor.close();
            }
        }
        return qpVertices;

    }
    public static List<LatLng> getPolygonForLocation(Context context, long locationID){
        dbHelper = DBHelper.getInstance(context);
        Cursor cursor=null;
        String query = "select * from location_shape where location_id = "+locationID+";";

        List<LatLng> polygon = new ArrayList<>();
        try {
            cursor = dbHelper.dbRawQuery(query);
            while(cursor.moveToNext()){
                polygon.add(getLatLng(cursor));
            }

        }
        catch (Exception e) {
            e.printStackTrace();
        }
        finally {
            if(cursor!=null) {
                cursor.close();
            }
        }
        return polygon;

    }



    public static LatLng calculateDerivedPosition(LatLng point,
                                                  double range, double bearing)
    {
        double EarthRadius = 6371000; // m

        double latA = Math.toRadians(point.latitude);
        double lonA = Math.toRadians(point.longitude);
        double angularDistance = range / EarthRadius;
        double trueCourse = Math.toRadians(bearing);

        double lat = Math.asin(
                Math.sin(latA) * Math.cos(angularDistance) +
                        Math.cos(latA) * Math.sin(angularDistance)
                                * Math.cos(trueCourse));

        double dlon = Math.atan2(
                Math.sin(trueCourse) * Math.sin(angularDistance)
                        * Math.cos(latA),
                Math.cos(angularDistance) - Math.sin(latA) * Math.sin(lat));

        double lon = ((lonA + dlon + Math.PI) % (Math.PI * 2)) - Math.PI;

        lat = Math.toDegrees(lat);
        lon = Math.toDegrees(lon);

        LatLng newPoint = new LatLng(lat,lon);

        return newPoint;

    }
}
