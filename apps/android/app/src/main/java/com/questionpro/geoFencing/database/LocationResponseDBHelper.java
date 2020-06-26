package com.questionpro.geoFencing.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import com.questionpro.geoFencing.model.QPLocationResult;

import java.util.ArrayList;

/**
 * Created by sachinsable on 1/23/18.
 */

public class LocationResponseDBHelper extends SQLiteOpenHelper {
    public static String CREATE_TABLE = "create table if not exists location_response ("+
            "_id integer primary key autoincrement, " +
            "location_group_id integer, " +
            "location_id integer, " +
            "location_name text, " +
            "track_type text, " +
            "track_movement_type text, " +
            "time_stamp integer, "+
            "battery_percentage text, "+
            "unique_key integer);";

    public final String TABLE_NAME = "location_response";
    public static String RESPONSE_DB_NAME = "qp_location_result.sqlite";
    public static int DB_VERSION = 2;
    private static LocationResponseDBHelper instance = null;
    private SQLiteDatabase mDatabase = null;
    public LocationResponseDBHelper(Context context){
        super(context, RESPONSE_DB_NAME,null, DB_VERSION);
        mDatabase = getWritableDatabase();
    }
    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_TABLE);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        if(oldVersion ==1 && newVersion == 2){
            db.execSQL("alter table "+TABLE_NAME+" add column unique_key integer default -1");
        }
    }

    public static LocationResponseDBHelper getInstance(Context context){
        if(instance == null) {
            instance = new LocationResponseDBHelper(context);
        }
        return instance;
    }


    public void insert(QPLocationResult qpLocationResult){
        ContentValues contentValues = new ContentValues();
        contentValues.put("location_group_id",qpLocationResult.locationGroupID);
        contentValues.put("location_id", qpLocationResult.locationID);
        contentValues.put("location_name", qpLocationResult.locationName);
        contentValues.put("track_type",qpLocationResult.trackType.name());
        contentValues.put("track_movement_type", qpLocationResult.trackMovementType.name());
        contentValues.put("time_stamp", qpLocationResult.timeStamp);
        contentValues.put("battery_percentage", qpLocationResult.batterPercentage);
        contentValues.put("unique_key", qpLocationResult.uniqueKey);
        mDatabase.beginTransaction();
        Log.i("Sachin","inserting "+ mDatabase.insert(TABLE_NAME, null,contentValues)+ " row");
        mDatabase.setTransactionSuccessful();
        mDatabase.endTransaction();
    }

    public QPLocationResult getQPLocationResult(Cursor c){
        QPLocationResult qpLocationResult = new QPLocationResult();
        qpLocationResult.id = c.getInt(c.getColumnIndex("_id"));
        qpLocationResult.locationGroupID = c.getLong(c.getColumnIndex("location_group_id"));
        qpLocationResult.locationID = c.getLong(c.getColumnIndex("location_id"));
        qpLocationResult.locationName = c.getString(c.getColumnIndex("location_name"));
        qpLocationResult.trackType = QPLocationResult.TrackType.valueOf(c.getString(c.getColumnIndex("track_type")));
        qpLocationResult.trackMovementType= QPLocationResult.TrackMovementType.valueOf(c.getString(c.getColumnIndex("track_movement_type")));
        qpLocationResult.timeStamp = c.getLong(c.getColumnIndex("time_stamp"));
        qpLocationResult.batterPercentage = c.getString(c.getColumnIndex("battery_percentage"));
        qpLocationResult.uniqueKey = c.getLong(c.getColumnIndex("unique_key"));
        return qpLocationResult;
    }


    public ArrayList<QPLocationResult> getAllLocationResults(){
        Cursor c =  null;
        ArrayList<QPLocationResult> qpLocationResults = new ArrayList<>();
        try {
            c = mDatabase.query(TABLE_NAME, null, null, null, null, null, null);
            if (c.moveToFirst()) {
                do {
                    qpLocationResults.add(getQPLocationResult(c));
                } while (c.moveToNext());

            }
        }
        catch (Exception e){
            e.printStackTrace();
        }
        finally {
            if(null != c){
                c.close();
            }
        }
        return qpLocationResults;
    }

    public void deleteResponses(){
        mDatabase.beginTransaction();
        mDatabase.delete(TABLE_NAME, null, null);
        mDatabase.setTransactionSuccessful();
        mDatabase.endTransaction();
    }
}
