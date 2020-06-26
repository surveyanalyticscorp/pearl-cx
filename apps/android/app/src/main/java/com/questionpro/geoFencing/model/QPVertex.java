package com.questionpro.geoFencing.model;

/**
 * Created by sachinsable on 1/15/18.
 */

public class QPVertex {

    private long id;
    private long locationID;
    private long locationGroupID;
    private double latitude;
    private double longitude;
    public QPVertex(){}

    public QPVertex(long id, long locationID, long locationGroupID, double latitude, double longitude) {
        this.id = id;
        this.locationID = locationID;
        this.locationGroupID = locationGroupID;
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
}
