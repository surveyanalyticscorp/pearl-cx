package com.questionpro.response;

import com.alibaba.fastjson.JSONObject;
import com.questionpro.exception.QPException;

import java.util.ArrayList;

/**
 * Created by sachinsable on 22/08/16.
 */

public abstract class BaseResponse {
    public abstract String parseResponse(JSONObject response) throws QPException;
    public int statusCode;
    public ArrayList<ValidationError> validationErrors;
    public String errorAlertMessage;



    public class ValidationError{
        String field;
        String errorMessage;
        public ValidationError(String field, String errorMessage){
            this.field = field;
            this.errorMessage = errorMessage;
        }
    }




}
