package com.questionpro.model;

import com.alibaba.fastjson.JSONObject;

import java.util.ArrayList;

/**
 * Created by minu on 11/10/2017.
 */
public class ContextMenuContent {
    public ArrayList<MenuActive> menuItems = new ArrayList<>();

    public static ContextMenuContent fromJSON(JSONObject menuJSON) {
        ContextMenuContent contextMenuContent = new ContextMenuContent();
        MenuActive menuLinks = MenuActive.fromJSON(menuJSON);
        contextMenuContent.menuItems.add(menuLinks);
        return contextMenuContent;

    }
}
