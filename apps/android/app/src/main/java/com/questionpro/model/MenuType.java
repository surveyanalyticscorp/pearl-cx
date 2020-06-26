package com.questionpro.model;

public enum MenuType{

    LOGOUT("logout"),
    SHARE("share"),
    LINK("link"),
    HOME("home"),
    APP_URL("appUrl"),
    DYNAMIC("dynamic"),
    DYNAMIC_WITH_BADGE("dynamicWithBadge");

    private String menuType="";
    MenuType(String menuType){
        this.menuType = menuType;
    }

    public String getValue(){
        return menuType;
    }

    public static MenuType resolve(String type){
        for(MenuType menuType: MenuType.values()){
            if(menuType.getValue().equalsIgnoreCase(type)){
                return menuType;
            }
        }
        return MenuType.LINK;
    }
  }