package com.questionpro.exception;

/**
 * Created by sachinsable on 22/08/16.
 */

public class InvalidEmailPasswordException extends QPException {
    public InvalidEmailPasswordException(String message){
        super(message);
    }
}
