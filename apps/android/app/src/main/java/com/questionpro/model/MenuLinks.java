package com.questionpro.model;

import android.graphics.drawable.Drawable;

import com.alibaba.fastjson.JSONObject;

import java.util.Comparator;

/**
 * Created by sachinsable on 22/08/16.
 */

public class MenuLinks implements Comparable<MenuLinks>{
    public int id;
    public Drawable icon;
    public int orderNumber;
    public String name="";
    public String title="";
    public String questionTitle = "";
    public JSONObject data;
    public int badge = 0;
    public int totalResponse = 0;
    public MenuType type;
    public String key="";
    public String url="";
    public String category= "";
    public boolean separator=false;
    public boolean active = false;
    public boolean enabled = true;

    public static MenuLinks fromJSON(JSONObject jsonObject){
        MenuLinks menuLinks = new MenuLinks();
        if(jsonObject.containsKey("name")){
            menuLinks.name = jsonObject.getString("name");
        }
        if(jsonObject.containsKey("title")){
            menuLinks.title = jsonObject.getString("title");
        }
        if(jsonObject.containsKey("type")){
            menuLinks.type = MenuType.valueOf(jsonObject.getString("type"));
        }
        if(jsonObject.containsKey("url")){
            menuLinks.url = jsonObject.getString("url");
        }
        if(jsonObject.containsKey("data")){
            menuLinks.data = jsonObject.getJSONObject("data");
        }
        if(jsonObject.containsKey("separator")){
            menuLinks.separator = jsonObject.getBoolean("separator");
        }
        if(jsonObject.containsKey("orderNumber")){
            menuLinks.orderNumber = jsonObject.getInteger("orderNumber");
        }
        if(jsonObject.containsKey("active")){
            menuLinks.active = jsonObject.getBoolean("active");
        }
        if(jsonObject.containsKey("questionTitle")){
            menuLinks.questionTitle = jsonObject.getString("questionTitle");
        }
        if(jsonObject.containsKey("totalResponse")){
            menuLinks.totalResponse = jsonObject.getInteger("totalResponse");
        }
        if(jsonObject.containsKey("category")){
            menuLinks.category = jsonObject.getString("category");
        }
        return  menuLinks;
    }

    @Override
    public int compareTo(MenuLinks another) {
        return this.orderNumber - another.orderNumber;
    }

    public static JSONObject toJSON(MenuLinks menuLinks){
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("name", menuLinks.name);
        jsonObject.put("title", menuLinks.title);
        jsonObject.put("type", menuLinks.type);
        jsonObject.put("url", menuLinks.url);
        jsonObject.put("data", menuLinks.data);
        jsonObject.put("separator", menuLinks.separator);
        jsonObject.put("eventType","routeChange");
        jsonObject.put("questionTitle",menuLinks.questionTitle);
        jsonObject.put("totalResponse",menuLinks.totalResponse);
        jsonObject.put("category", menuLinks.category);
        return jsonObject;

    }

    public static Comparator<MenuLinks> menuLinksComparator
            = new Comparator<MenuLinks>() {

        public int compare(MenuLinks menu1, MenuLinks menu2) {



            //ascending order
            return menu1.compareTo(menu2);

            //descending order
            //return fruitName2.compareTo(fruitName1);
        }

    };

}
