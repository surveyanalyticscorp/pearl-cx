package com.questionpro.network;

import android.util.Log;

import com.alibaba.fastjson.JSONException;
import com.alibaba.fastjson.JSONObject;

import org.apache.http.HttpEntity;
import org.apache.http.entity.HttpEntityWrapper;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.SocketException;
import java.net.URL;
import java.util.zip.GZIPInputStream;

public class ServerDataConnector {
	public ProgressUpdater updater;
	private int connectionTimeout = 30000;
	private int socketTimeout = 32000;
	private static ServerDataConnector instance = new ServerDataConnector();

    private final int HTTP_POST = 1;
    private final int HTTP_GET = 2;
	private ServerDataConnector() {

	}

	public static ServerDataConnector getInstance() {
		return instance;
	}

    private String openConnection(String url, int method, String payload, String authToken) throws IOException, MalformedURLException, SocketException,Exception{
        HttpURLConnection urlConnection = null;
        try {

            URL uRL = new URL(url);
            urlConnection = (HttpURLConnection)uRL.openConnection();
            urlConnection.setRequestProperty("Content-Type", "application/json; charSet=UTF-8");
            urlConnection.setRequestProperty("Auth-Token",authToken);
            urlConnection.setConnectTimeout(connectionTimeout);
            urlConnection.setDoOutput(true);
            urlConnection.setDoInput(true);
            if(method == HTTP_POST) {
                urlConnection.setRequestMethod("POST");
                OutputStream os = urlConnection.getOutputStream();
                os.write(payload.getBytes("UTF-8"));
                os.close();
            }
            else{
                urlConnection.setRequestMethod("GET");
            }

            InputStream in = urlConnection.getErrorStream();
            if(in == null) {
             in =new BufferedInputStream(urlConnection.getInputStream());
            }
            String s = convertStreamToString(in);
            in.close();
            return s;
        }
        finally{
            if(urlConnection!=null) {
                urlConnection.disconnect();
            }
        }
    }


	private String convertStreamToString(InputStream is)  {

        StringBuilder sb = new StringBuilder();
        try {

            BufferedReader reader = new BufferedReader(new InputStreamReader(is,
                    "UTF-8"));

            String line = null;

            while ((line = reader.readLine()) != null) {
                sb.append(line + "\n");
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
				if(is != null)
                is.close();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return sb.toString();
    }

    public JSONObject postJSONRequest(String url, String payload)
            throws Exception {
	    return postJSONRequest(url,payload,"");
    }

	public JSONObject postJSONRequest(String url, String payload, String authToken)
            throws  Exception {
        JSONObject json = null;
        String response = openConnection(url, HTTP_POST, payload,authToken);
        Log.i("URL-",url);
        Log.i("Response", response);
        try {
            if (response != null) {
                json = JSONObject.parseObject(response);
            } else {
                new ProgressUpdater.SilentProgressUpdater().updateProgress(new ProgressUnit(
                        "empty_response_from_server", ProgressUnit.FATAL_ERROR));
            }
        }
        catch (JSONException e){
            e.printStackTrace();
            new ProgressUpdater.SilentProgressUpdater().updateProgress(new ProgressUnit("Internal server error.", ProgressUnit.FATAL_ERROR));
        }
        //Log.d("Post", "End->" + System.currentTimeMillis());
		return json;
		
	}

	public JSONObject getJSONRequest(String url, String authToken) throws Exception{
        JSONObject json = null;
        String response = openConnection(url, HTTP_GET, "",authToken);
        Log.i("URL-",url);
        Log.i("Response", response);
        try {
            if (response != null) {
                json = JSONObject.parseObject(response);
            } else {
                new ProgressUpdater.SilentProgressUpdater().updateProgress(new ProgressUnit(
                        "empty_response_from_server", ProgressUnit.FATAL_ERROR));
            }
        }
        catch (JSONException e){
            e.printStackTrace();
            new ProgressUpdater.SilentProgressUpdater().updateProgress(new ProgressUnit("Internal server error.", ProgressUnit.FATAL_ERROR));
        }
        //Log.d("Post", "End->" + System.currentTimeMillis());
        return json;
    }






	/**
	 * Simple {@link HttpEntityWrapper} that inflates the wrapped
	 * {@link HttpEntity} by passing it through {@link GZIPInputStream}.
	 */
	private static class InflatingEntity extends HttpEntityWrapper {
		public InflatingEntity(HttpEntity wrapped) {
			super(wrapped);
		}

		@Override
		public InputStream getContent() throws IOException {
			return new GZIPInputStream(wrappedEntity.getContent());
		}

		@Override
		public long getContentLength() {
			return -1;
		}
	}

//	public void registerPushToken(String regId) throws Exception{
//		String url = globalData.getCurrentSyncService()
//				.getRegisterPushTokenURL();
//
//			JSONObject payload = new JSONObject();
//			payload.put("pushToken", regId);
//			payload.put("deviceType", 2);
//			JSONObject response = postJSONRequest(
//					new ProgressUpdater.SilentProgressUpdater(), url,
//					payload.toString());
//
//			// throw away the response
//			if (response == null) {
//				// Nothing we can do - just log it
//					throw new Exception(String.format(globalData.getContext().getResources().getString(R.string.could_not_register_push_token), regId));
//			}
//
//	}

	public void unregisterPushToken(String regId) {
		// TODO : later on we can unregister also
	}


	public void downloadAndSaveFile(String fromURL,String savePathWithFileName) throws Exception{
        URL url = new URL(fromURL);
        HttpURLConnection c = (HttpURLConnection) url.openConnection();//Open Url Connection
        c.setRequestMethod("GET");//Set Request Method to "GET" since we are grtting data
        c.connect();
        if (c.getResponseCode() != HttpURLConnection.HTTP_OK) {
            Log.e("ServerDataConnector", "Server returned HTTP " + c.getResponseCode()
                    + " " + c.getResponseMessage());
            return;
        }

        File outputFile = new File(savePathWithFileName);
        if(!outputFile.exists()){
            outputFile.createNewFile();
        }
        FileOutputStream fos = null;
        InputStream is = null;
        try {
            fos = new FileOutputStream(outputFile);//Get OutputStream for NewFile Location

            is = c.getInputStream();
            byte[] buffer = new byte[1024];//Set buffer type
            int len1 = 0;//init length
            while ((len1 = is.read(buffer)) != -1) {
                fos.write(buffer, 0, len1);//Write new file
            }
        }finally {
            //Close all connection after doing task
            if(fos!= null) {
                fos.close();
            }
            if(is != null ) {
                is.close();
            }
        }



    }

}
