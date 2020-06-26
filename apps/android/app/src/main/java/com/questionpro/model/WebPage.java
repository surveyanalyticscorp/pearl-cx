package com.questionpro.model;

import com.alibaba.fastjson.JSONObject;

/**
 * Created by sachinsable on 18/08/16.
 */

public class WebPage {
    public long id;
    public String title;
    public MainMenu mainMenu;
    public ContextMenu contextMenu;
    public int memberCount = -1;
    public ContextMenuContent contextMenuContent;
    // @minu Show dynamic and static image on Navigation for Performance Review.
    public String image = "";
    public boolean isStatic;
    // @minu for Objective and Goals.
    public boolean showMenu;
    public boolean showStat;
    public boolean showCloseButton;

    public static WebPage fromJSON(JSONObject jsonObject){
        WebPage webPage = new WebPage();
        if(jsonObject.containsKey("title")){
            webPage.title = jsonObject.getString("title");
        }
        if (jsonObject.containsKey("image")) {
            webPage.image = jsonObject.getString("image");
        }

        // @minu Set variable for the key showStat
        if (jsonObject.containsKey("showStat")) {
            webPage.showStat = (jsonObject.getBoolean("showStat"));
        }

        //@minu Set variable for the key isStatic
        if (jsonObject.containsKey("isStatic")) {
            webPage.isStatic = jsonObject.getBoolean("isStatic");
        }

        //@minu Set variable for the key showMenu
        if (jsonObject.containsKey("showMenu")) {
            webPage.showMenu = jsonObject.getBoolean("showMenu");
        }

        if (jsonObject.containsKey("contextMenu")) {
            webPage.contextMenu = ContextMenu.fromJSON(jsonObject.getJSONObject("contextMenu"));
        } else {
            webPage.contextMenu = new ContextMenu();
        }

        //@minu set variable for the key contextMenuContent
        if (jsonObject.containsKey("contextMenuContent")) {
            webPage.contextMenuContent = ContextMenuContent.fromJSON(jsonObject.getJSONObject("contextMenuContent"));
        } else {
            webPage.contextMenuContent = new ContextMenuContent();
        }
        if(jsonObject.containsKey("body")){
            JSONObject body = jsonObject.getJSONObject("body");
            if(body.containsKey("memberCount")){
                webPage.memberCount = body.getInteger("memberCount");
            }
        }


        //@sachin for CX
        if(jsonObject.containsKey("showCloseButton")){
            webPage.showCloseButton = jsonObject.getBoolean("showCloseButton");
        }

        return  webPage;
    }
}
