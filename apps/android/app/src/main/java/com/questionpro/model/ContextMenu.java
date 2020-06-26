package com.questionpro.model;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import java.util.ArrayList;

/**
 * Created by sachinsable on 18/08/16.
 */

public class ContextMenu {


  public ArrayList<MenuLinks> menuItems= new ArrayList<>();

  public static ContextMenu fromJSON(JSONObject menuJSON){
    ContextMenu contextMenu = new ContextMenu();
    JSONArray jsonArray = menuJSON.getJSONArray("menuLinks");
    for(int i=0;i<jsonArray.size();i++){
      MenuLinks menuLinks = MenuLinks.fromJSON(jsonArray.getJSONObject(i));
      contextMenu.menuItems.add(menuLinks);
    }
    return contextMenu;

  }
}
