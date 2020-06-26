package com.questionpro.service;

/**
 * Created by sachinsable on 22/08/16.
 */

public class HttpConnector {

    private static HttpConnector httpConnectorInstace;

    private HttpConnector (){}

    public static HttpConnector getHttpConnectorInstace(){
        if(httpConnectorInstace == null){
            httpConnectorInstace = new HttpConnector();
        }
        return  httpConnectorInstace;
    }


    public void connect(){

    }
}
