package com.questionpro.model;

import com.alibaba.fastjson.JSONObject;

/**
 * Created by minu on 11/3/2017.
 */

public class MenuActive {
    public String activeCount = "";
    public String archieveCount = "";
    public String edit = "";
    public String selected = "";

    public static MenuActive fromJSON(JSONObject jsonObject) {
        MenuActive menuLinks = new MenuActive();

        if (jsonObject.containsKey(Constants.active)) {
            menuLinks.activeCount = jsonObject.getString(Constants.active);
        }
        if (jsonObject.containsKey(Constants.context)) {
            menuLinks.edit = jsonObject.getString(Constants.context);
        }
        if (jsonObject.containsKey(Constants.archived)) {
            menuLinks.archieveCount = jsonObject.getString(Constants.archived);
        }
        if (jsonObject.containsKey(Constants.selected)) {
            menuLinks.selected = jsonObject.getString(Constants.selected);
        }

        return menuLinks;
    }

}