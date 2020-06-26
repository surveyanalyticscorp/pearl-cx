package com.questionpro.geoFencing.database;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;

import com.questionpro.model.AppUser;

import java.io.File;

/**
 * Created by Dattatraya Kunde on 26/09/17.
 */

public class DBHelper extends SQLiteOpenHelper {
    public static final String LOCATION_DB_NAME = "LocationSurvey.sqlite";
    public SQLiteDatabase sqLiteDatabase;
    private static DBHelper instance;
    static int DATABASE_VERSION = 1;

    public DBHelper(Context context) {
        super(context, LOCATION_DB_NAME, null, DATABASE_VERSION);

        //String dir="/data/data/com.questionpro.communities/files/LocationSurvey.sqlite";
        File dbfile = new File(AppUser.getLocationSurveyDBLocation(context));
        sqLiteDatabase = SQLiteDatabase.openOrCreateDatabase(dbfile, null);

        //sqLiteDatabase = this.getWritableDatabase();
    }


    /**
     * To get the instance of the database
     *
     * @param context
     * @return
     */
    public static DBHelper getInstance(Context context) {
        if (instance == null)
            instance = new DBHelper(context);

        /** if database is closed accidently.. it will reopen it here.*/
        if (!instance.sqLiteDatabase.isOpen()) {
            instance.sqLiteDatabase = instance.getWritableDatabase();
        }
        return instance;
    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        /** create  table */
        //db.execSQL(DBConfig.HELP_TBL);
    }


    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS mycontacts");
        onCreate(db);

    }

    /**
     * @param tableName
     * @param contentValues
     */
    public long dbAddRecord(String tableName, ContentValues contentValues) {
        return sqLiteDatabase.insert(tableName, null, contentValues);
    }


    /**
     * @param query
     * @return
     */
    public Cursor dbRawQuery(String query) {
        Cursor cursor = sqLiteDatabase.rawQuery(query, null);
        return cursor;
    }

    /**
     * @param cursor
     * @return
     */
    public int dbGetRecordCount(Cursor cursor) {
        return cursor.getCount();
    }

    /**
     * @param cursor
     * @return
     */
    public boolean dbFetchNextRecord(Cursor cursor) {
        return cursor.moveToNext();

    }

    /**
     * @param cursor
     * @param coloumnName
     * @return
     */
    public String getString(Cursor cursor, String coloumnName) {
        return cursor.getString(cursor.getColumnIndex(coloumnName));
    }

    /**
     * @param cursor
     * @param coloumnName
     * @return
     */
    public int getInt(Cursor cursor, String coloumnName) {
        return cursor.getInt(cursor.getColumnIndex(coloumnName));
    }

    /**
     * @param query
     */
    public void dbQuery(String query) {
        sqLiteDatabase.execSQL(query);
    }

    public boolean dbFetchFirstRecord(Cursor cursor) {
        return cursor.moveToFirst();
    }


    /**
     *
     */
    public void closeDb() {
        //sqLiteDatabase.close();
    }

    public void closeDatabase() {
        sqLiteDatabase.close();
    }
}
