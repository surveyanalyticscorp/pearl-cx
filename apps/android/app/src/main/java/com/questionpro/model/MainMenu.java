package com.questionpro.model;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.util.ArrayList;

/**
 * Created by sachinsable on 18/08/16.
 */

public class MainMenu {
    public String companyLogoUrl = "";
    public ArrayList<MenuLinks> menuItems = new ArrayList<>();
    public String profileImageUrl ="";
    public static JSONObject toJSON(MainMenu mainMenu){
        ArrayList<MenuLinks> menuItems = mainMenu.menuItems;
        JSONArray jsonArray = new JSONArray();
        for(MenuLinks menuLinks: menuItems){
            JSONObject jsonObject1 = new JSONObject();
            jsonObject1.put("title", menuLinks.title);
            jsonObject1.put("name", menuLinks.name);
            jsonObject1.put("type", menuLinks.type);
            jsonObject1.put("url", menuLinks.url);
            jsonObject1.put("separator", menuLinks.separator);
            jsonArray.add(jsonObject1);
        }

        JSONObject menuJSON = new JSONObject();
        menuJSON.put("menuLinks", jsonArray);

        menuJSON.put("companyLogoUrl", mainMenu.companyLogoUrl);
        menuJSON.put("profileImageUrl", mainMenu.profileImageUrl);
        return  menuJSON;
    }

    public static MainMenu fromJSON(JSONObject jsonObject){
        MainMenu mainMenu = new MainMenu();
        JSONArray menuLinks = jsonObject.getJSONArray("menuLinks");
        for(int i =0; i < menuLinks.size();i++){
            JSONObject menuItem = menuLinks.getJSONObject(i);
            mainMenu.menuItems.add(MenuLinks.fromJSON(menuItem));
        }
        if(jsonObject.containsKey("companyLogoUrl")){
            mainMenu.companyLogoUrl = jsonObject.getString("companyLogoUrl");
        }
        if(jsonObject.containsKey("profileImageUrl")){
            mainMenu.profileImageUrl = jsonObject.getString("profileImageUrl");
        }
        return  mainMenu;
    }
}
