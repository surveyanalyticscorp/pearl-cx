package com.questionpro.exception;

/**
 * Created by sachinsable on 17/10/16.
 */

public class NoConnectivityException extends QPException {

    public NoConnectivityException(){
        super("No Working internet connection found. Please check your network settings.");
    }
}
