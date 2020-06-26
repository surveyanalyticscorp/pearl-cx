package com.questionpro.service;

import org.json.JSONObject;

public interface JSONenabled {

	/**
	 * converts to a JSON formatted string
	 * @return
	 */
	public String toJSON();
	
	/**
	 * loads object from a JSON formatted string
	 * @param jsonString
	 * @param type TODO
	 */
	public void fromJSON(String jsonString, String type);
	
	/**
	 * Load the object from a JSONObject
	 * @param jsonObj
	 * @param type TODO
	 */
	public void fromJSONObj(JSONObject jsonObj, String type);

}
