package com.questionpro.service;


import com.questionpro.utils.Utils;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.Serializable;

public class RequestStatus implements JSONenabled, Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = -8604831553106689644L;
	
	public String method; //Method response came from
	public String message; //Status Message returned
	public int responseCode; //responseError Code - <200 || > 299 bad
	
	public RequestStatus(int code, String method, String message) {
		this.responseCode = code;
		this.method = method;
		this.message = message;
	}
	public RequestStatus() {
	}
	public String toJSON() {
		throw new UnsupportedOperationException("toJSON not supported by RequestStatus Object");
	}
	
	public static RequestStatus createFromJSON(JSONObject json) {
		RequestStatus status = new RequestStatus();
		status.fromJSONObj(json, null);
		return status;
		
	}

	public void fromJSON(String jsonString, String type) {
		try {
			JSONObject jso = new JSONObject(jsonString);
			fromJSONObj(jso, null);
		} catch (JSONException jse) {
			Utils.printLog("RequestStatus", "Error parsing Status Object: " + jsonString, 'e');
		}
	}
	
	public void fromJSONObj(JSONObject jobj, String type) {
		try {
		setMethod(jobj.getString("method"));
		setMessage(jobj.getString("message"));
		setResponseCode(jobj.getInt("id"));
		} catch (JSONException jse) {
			Utils.printLog("RequestStatus","Error loading from JSONObject: " +jse.toString(), 'e');
		}
	}

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public int getResponseCode() {
		return responseCode;
	}

	public void setResponseCode(int responseCode) {
		this.responseCode = responseCode;
	}
}
