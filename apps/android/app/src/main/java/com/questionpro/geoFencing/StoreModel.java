package com.questionpro.geoFencing;

import android.location.Location;

import com.google.android.gms.maps.model.LatLng;

import java.util.List;

/**
 * Created by sachinsable on 1/3/18.
 */

public class StoreModel {
    private int id;



    private String name= "";
    private Location location;

    public List<LatLng> getPolygon() {
        return polygon;
    }

    public void setPolygon(List<LatLng> polygon) {
        this.polygon = polygon;
    }

    private List<LatLng> polygon;
    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Location getLocation() {
        return location;
    }

    public void setLocation(Location location) {
        this.location = location;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public StoreModel(int id, Location location, List<LatLng> polygon){
        this.id = id;
        this.location = location;
        this.polygon = polygon;

    }
    public StoreModel(int id, Location location, List<LatLng> polygon, String name){
        this.id = id;
        this.location = location;
        this.polygon = polygon;
        this.name = name;

    }

    @Override
    public String toString() {
        return "Id- "+this.id + "; Location-"+this.location.toString();
    }
}
