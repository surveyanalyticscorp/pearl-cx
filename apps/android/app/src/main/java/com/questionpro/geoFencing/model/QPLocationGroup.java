package com.questionpro.geoFencing.model;

import java.sql.Date;

/**
 * Created by sachinsable on 1/15/18.
 */

public class QPLocationGroup {

    private long id;
    private long locationGroupID;
    private int panelID;
    private String surveyIDList;
    private String name;

    private int qPoint;
    private int radius;
    private int delayTime;
    private Date startDate;
    private Date endDate;

    public  QPLocationGroup(){}

    public QPLocationGroup(long id, long locationGroupID, int panelID, String surveyIDList, String name, int qPoint, int radius, int delayTime) {
        this.id = id;
        this.locationGroupID = locationGroupID;
        this.panelID = panelID;
        this.surveyIDList = surveyIDList;
        this.name = name;
        this.qPoint = qPoint;
        this.radius = radius;
        this.delayTime = delayTime;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getLocationGroupID() {
        return locationGroupID;
    }

    public void setLocationGroupID(long locationGroupID) {
        this.locationGroupID = locationGroupID;
    }

    public int getPanelID() {
        return panelID;
    }

    public void setPanelID(int panelID) {
        this.panelID = panelID;
    }

    public String getSurveyIDList() {
        return surveyIDList;
    }

    public void setSurveyIDList(String surveyIDList) {
        this.surveyIDList = surveyIDList;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getqPoint() {
        return qPoint;
    }

    public void setqPoint(int qPoint) {
        this.qPoint = qPoint;
    }

    public int getRadius() {
        return radius;
    }

    public void setRadius(int radius) {
        this.radius = radius;
    }

    public int getDelayTime() {
        return delayTime;
    }

    public void setDelayTime(int delayTime) {
        this.delayTime = delayTime;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }


}
