package com.questionpro.service;

/**
 * Created by sachinsable on 22/08/16.
 */

public class WebSocketConnector {

    private static WebSocketConnector webSocketConnectorInstance=null;

    private WebSocketConnector(){

    }
    public static WebSocketConnector getWebSocketConnectorInstance(){
        if(webSocketConnectorInstance==null){
            webSocketConnectorInstance = new WebSocketConnector();
        }
        return webSocketConnectorInstance;
    }


}
