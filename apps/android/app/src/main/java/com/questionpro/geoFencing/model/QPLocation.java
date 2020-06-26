package com.questionpro.geoFencing.model;


import android.location.Location;

import java.util.ArrayList;

/**
 * Created by sachinsable on 1/15/18.
 */

public class QPLocation {

    private long id;
    private long locationID;
    private long locationGroupID;

    private String address;
    private double latitude;
    private double longitude;


    public QPLocation(){}


    public QPLocation(long id, long locationID, long locationGroupID, String address, double latitude, double longitude) {
        this.id = id;
        this.locationID = locationID;
        this.locationGroupID = locationGroupID;
        this.address = address;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getLocationID() {
        return locationID;
    }

    public void setLocationID(long locationID) {
        this.locationID = locationID;
    }

    public long getLocationGroupID() {
        return locationGroupID;
    }

    public void setLocationGroupID(long locationGroupID) {
        this.locationGroupID = locationGroupID;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }


    public Location getLocation(){
        Location location = new Location("");
        location.setLatitude(this.latitude);
        location.setLongitude(this.longitude);
        return location;
    }

    public static QPLocation getQPLocationByID(long id, ArrayList<QPLocation> qpLocations){
        for(QPLocation qpLocation : qpLocations){
            if(qpLocation.getId() == id){
                return qpLocation;
            }
        }
        return null;
    }

//    public static StoreModel getGeoFenceStoreModelForLocation(ArrayList<Long> qpLocationIds, Location location){
//
//        for(long id : qpLocationIds){
//            StoreModel storeModel = getQPLocationByID(id, Constants.PUNE_STORES);
//            if(storeModel.getLocation().distanceTo(location) <= Constants.GEOFENCE_RADIUS_IN_METERS){
//                return storeModel;
//            }
//
//        }
//        return null;
//    }


}
