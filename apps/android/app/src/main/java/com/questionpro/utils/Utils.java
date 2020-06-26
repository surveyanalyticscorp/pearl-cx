package com.questionpro.utils;

import android.app.Activity;
import android.app.ActivityManager;
import android.app.ActivityManager.RunningTaskInfo;
import android.app.ProgressDialog;
import android.content.ContentResolver;
import android.content.Context;
import android.content.Intent;
import android.content.res.AssetManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Typeface;
import android.location.Location;
import android.location.LocationManager;
import android.location.LocationProvider;
import android.media.AudioManager;
import android.media.Ringtone;
import android.media.RingtoneManager;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.os.Vibrator;
import android.provider.MediaStore.MediaColumns;
import android.provider.Settings;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.View;
import android.view.View.MeasureSpec;
import android.view.ViewGroup;
import android.view.inputmethod.InputMethodManager;
import android.widget.EditText;
import android.widget.ListAdapter;
import android.widget.ListView;
import android.widget.Toast;

import com.questionpro.whitelabelapps.R;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigInteger;
import java.nio.channels.FileChannel;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.regex.Pattern;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

import static android.util.TypedValue.COMPLEX_UNIT_DIP;
import static android.util.TypedValue.applyDimension;

public class Utils 
{
	private static ProgressDialog currentProgressDialog = null;
	// don't allow instance creation
	private Utils() {}
	
	
	/**
	 * 
	 * This function is used to print the log
	 * 
	 * @param tag
	 * @param msg
	 * @param type
	 */
	public static void printLog(String tag, String msg, char type)
	{
		if(type=='e')
			Log.e(tag, msg);
		else if(type=='d')
			Log.d(tag, msg);
		else if(type=='i')
			Log.i(tag, msg);
		else if(type=='v')
			Log.v(tag, msg);
		else if(type=='w')
			Log.w(tag, msg);
	}
	
	
	public static boolean stringIsNullOrEmpty(String s) {
		if (s == null || s.length() == 0) return true;
		return false;
	}

	

	public static boolean isTablet(Context context) 
	{
	    boolean xlarge = ((context.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == 4);
	    boolean large = ((context.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK) == Configuration.SCREENLAYOUT_SIZE_LARGE);
	    return (xlarge || large);
	}

	public static void hideStaticProgressDialog()
	{
		if (currentProgressDialog != null)
		{
			currentProgressDialog.dismiss();
			currentProgressDialog = null;
		}
	}
	

	
	/**
	 * 
	 * @param view
	 */
	public static void hideSoftKeyboard(View view) {
		Context context = view.getContext();
		InputMethodManager imm = (InputMethodManager)context.getSystemService(Context.INPUT_METHOD_SERVICE);
		imm.hideSoftInputFromWindow(view.getWindowToken(), 0);
	}
	
	/**
	 * 
	 * @param view
	 */
	public static void showSoftKeyboard(EditText view) {
		Context context = view.getContext();
		context.getApplicationContext();
		
	    InputMethodManager imm = (InputMethodManager)context.getSystemService(Context.INPUT_METHOD_SERVICE);
	    if(imm != null){
	    	imm.toggleSoftInput(InputMethodManager.SHOW_FORCED,0);
		}
	    
	    view.requestFocus();
	}
	
	
	/**
	 * 
	 * @param view
	 */
	public static void showSoftKeyboard(View view) {
		Context context = view.getContext();
		context.getApplicationContext();
		
	    InputMethodManager imm = (InputMethodManager)context.getSystemService(Context.INPUT_METHOD_SERVICE);
	    if(imm != null){
	    	imm.toggleSoftInput(InputMethodManager.SHOW_FORCED,0);
		}
	}
	
	/**
	 * 
	 * @param source
	 * @return
	 */
	public static String getMD5(String source) {
	    try {  
	        // Create MD5 Hash  
	        MessageDigest digest = MessageDigest.getInstance("MD5");
	        digest.update(source.getBytes());
	        byte messageDigest[] = digest.digest();

	        // Create Hex String
	        StringBuffer hexString = new StringBuffer();
	        for (int i=0; i<messageDigest.length; i++)
	            hexString.append(Integer.toHexString(0xFF & messageDigest[i]));

	        return hexString.toString();

	    } catch (NoSuchAlgorithmException e) {
	        e.printStackTrace();
	    }
	    return "";
	}

	public static boolean isActivityRunning(Context context) {

		ActivityManager activityManager = (ActivityManager)context.getSystemService (Context.ACTIVITY_SERVICE);
		    List<RunningTaskInfo> activitys = activityManager.getRunningTasks(Integer.MAX_VALUE);
		    boolean isActivityFound = false;
		    for (int i = 0; i < activitys.size(); i++) {
		    	Log.d("Datta", "Activity Name:"+activitys.get(i).toString());
		        if (activitys.get(i).topActivity.toString().equalsIgnoreCase("ComponentInfo{net.surveyswipe.android.ui/" +
		        		"net.surveyswipe.android.ui.Surveys}")) {
		            isActivityFound = true;
		        }
		    }
		    return isActivityFound;
	}



	/**
	 *
	 * @param context
	 */
	public static void playNotificationSound(Context context)
	{
		Vibrator v = (Vibrator) context.getSystemService(Context.VIBRATOR_SERVICE);
		 v.vibrate(1000);
		Uri uri = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);
		if (uri != null)
		{
			Ringtone rt = RingtoneManager.getRingtone(context, uri);

			if (rt != null)
			{
				rt.setStreamType(AudioManager.STREAM_NOTIFICATION);
				rt.play();
			}
		}
	}

	public static void showToastMessage(Context context, String message , int length){
		Toast.makeText(context.getApplicationContext(), message, length).show();
	}



	// workaround for listviews inside scrollviews
    public static void setListViewHeightBasedOnChildren(ListView listView) {
        ListAdapter listAdapter = listView.getAdapter();
        if (listAdapter == null) {
            // pre-condition
            return;
        }

        int totalHeight = 0;
        int desiredWidth = MeasureSpec.makeMeasureSpec(listView.getWidth(), MeasureSpec.AT_MOST);
        for (int i = 0; i < listAdapter.getCount(); i++) {
            View listItem = listAdapter.getView(i, null, listView);
            listItem.measure(desiredWidth, MeasureSpec.UNSPECIFIED);
            totalHeight += listItem.getMeasuredHeight();
        }

        ViewGroup.LayoutParams params = listView.getLayoutParams();
        params.height = totalHeight + (listView.getDividerHeight() * (listAdapter.getCount() - 1));
        listView.setLayoutParams(params);
        listView.requestLayout();
    }

  //decodes image and scales it to reduce memory consumption
    public static Bitmap decodeFile(Context cntx, Uri uri, int requiredWidth, int requiredHeight){

		try {
			 //Decode image size
			BitmapFactory.Options o = new BitmapFactory.Options();
			o.inJustDecodeBounds = true;
			InputStream in = cntx.getContentResolver().openInputStream(uri);
			BitmapFactory.decodeStream(in,null,o);
			in.close();

			//Find the correct scale value. It should be the power of 2.
			int scale=1;
			while(o.outWidth/scale/2>=requiredWidth && o.outHeight/scale/2>=requiredHeight)
			    scale*=2;

			//Decode with inSampleSize
			BitmapFactory.Options o2 = new BitmapFactory.Options();
			o2.inSampleSize=scale;
			o2.inPurgeable=true;                   //Tell to gc that whether it needs free memory, the Bitmap can be cleared
			in = cntx.getContentResolver().openInputStream(uri);
			Bitmap retBitmap = BitmapFactory.decodeStream(in, null, o2);
			in.close();
			return  retBitmap;

		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
    }

    public static boolean isValidEmail(String email){
    	return Pattern.matches("\\w+([-+.']\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*", email);
    }

    public static boolean isValidEmailForOutSmartFlu(String email)
    {
    	if(email.endsWith("@wisc.edu"))
    		return true;
    	else
    		return false;
    }



    /**
     * This method convets dp unit to equivalent device specific value in pixels.
     *
     * @param dp A value in dp(Device independent pixels) unit. Which we need to convert into pixels
     * @param context Context to get resources and device specific display metrics
     * @return A float value to represent Pixels equivalent to dp according to device
     */
    public static float convertDpToPixel(float dp,Context context){
		return (int) applyDimension(COMPLEX_UNIT_DIP, dp, context.getResources().getDisplayMetrics());
    }
    /**
     * This method converts device specific pixels to device independent pixels.
     *
     * @param px A value in px (pixels) unit. Which we need to convert into db
     * @param context Context to get resources and device specific display metrics
     * @return A float value to represent db equivalent to px value
     */
    public static float convertPixelsToDp(float px,Context context){
        Resources resources = context.getResources();
        DisplayMetrics metrics = resources.getDisplayMetrics();
        float dp = px / (metrics.densityDpi / 160f);
        return dp;

    }

    public static void updateMockLocation(Context cntx,double lat, double lon)
    {
    	String pname = "ss_networkprovider";
    	LocationManager mLocationManager = (LocationManager) cntx.getSystemService(Context.LOCATION_SERVICE);
        try{
        	mLocationManager.removeTestProvider(pname);
        }catch(Exception ex)
        {
        	Utils.printLog("LocationAlert",ex.getMessage(), 'i');
        }
        mLocationManager.addTestProvider
        (
           pname,
          "requiresNetwork" == "",
          "requiresSatellite" == "",
          "requiresCell" == "",
          "hasMonetaryCost" == "",
          "supportsAltitude" == "",
          "supportsSpeed" == "",
          "supportsBearing" == "",

          android.location.Criteria.POWER_LOW,
          android.location.Criteria.ACCURACY_FINE
        );

        Location newLocation = new Location(pname);

        if(lon==0){
        	double indx = lon;
	        lat = 33.554235 + indx * 0.0015;
			lon = -80.82485 + indx * 0.0015;
			if(lat>180)
			{
				lat = -180;
			}

			if(lon>180)
			{
				lon = -180;
			}
        }

        newLocation.setLatitude(lat);
        newLocation.setLongitude(lon);

        newLocation.setAccuracy(100);

        mLocationManager.setTestProviderEnabled
        (
          pname,
          true
        );

        mLocationManager.setTestProviderStatus
        (
           pname,
           LocationProvider.AVAILABLE,
           null,
           System.currentTimeMillis()
        );

        mLocationManager.setTestProviderLocation
        (
          pname,
          newLocation
        );
    }

    /**
     *
     * @param selectedVideoUri
     * @param cntx
     * @return
     */
    public static String getFilePathFromContentUri(Uri selectedVideoUri, Context cntx) {
    	ContentResolver contentResolver = cntx.getContentResolver();
        String filePath;
        if("content".equals(selectedVideoUri.getScheme())){
	        String[] filePathColumn = {MediaColumns.DATA};

	        Cursor cursor = contentResolver.query(selectedVideoUri, filePathColumn, null, null, null);
	        cursor.moveToFirst();

	        int columnIndex = cursor.getColumnIndex(filePathColumn[0]);
	        filePath = cursor.getString(columnIndex);
	        cursor.close();
        }
        else{

        	filePath = selectedVideoUri.toString();
        }
        File file = new File(filePath);
        return file.getName();
    }


    /**
	 * This function is used to hide the virtual keyboard.
	 *
	 * @param editText
	 * @param context
	 */
	public static void hideKeyBoard(EditText editText, Context context)
	{
		InputMethodManager inputMethodManager = (InputMethodManager) context.getSystemService(Context.INPUT_METHOD_SERVICE);
		inputMethodManager.hideSoftInputFromWindow(editText.getWindowToken(), 0);
	}


	/**
	 * This function is used to get new location according to input parameter.
	 *
	 * @param curLat
	 * @param curLong
	 * @param bearing
	 * @param radiousInFeet
	 * @return
	 */
	public static Location getNewLocation(double curLat,double curLong,float bearing,double radiousInFeet)
	{
		  Location newLocation= getDestinationPoint(curLat,curLong, bearing, feetToKilometers(radiousInFeet));
		    return newLocation;
	}


	/**
	 * This function is used to convert feet to kilometer.
	 *
	 * @param feet
	 * @return
	 */
	public static double feetToKilometers(double feet)
	{
		return feet/3280.8;
	}


	public static double metersToFeet(int meters){
		return meters * 3.2808;
	}
	/**
	 * This function is used to get the destination point of location
	 *
	 * @param curLat:Current location
	 * @param bearing: angle to find location
	 * @param depth: Distance in k.m.
	 * @return resulted location.
	 */
	public static Location getDestinationPoint(double curLat, double curLong, float bearing, double depth)
	{
	    Location newLocation = new Location("newLocation");

	    double radius = 6371.0; // earth's mean radius in km
	    double lat1 = Math.toRadians(curLat);
	    double lng1 = Math.toRadians(curLong);
	    double brng = Math.toRadians(bearing);
	    double lat2 = Math.asin( Math.sin(lat1)*Math.cos(depth/radius) + Math.cos(lat1)*Math.sin(depth/radius)*Math.cos(brng) );
	    double lng2 = lng1 + Math.atan2(Math.sin(brng)*Math.sin(depth/radius)*Math.cos(lat1), Math.cos(depth/radius)-Math.sin(lat1)*Math.sin(lat2));
	    lng2 = (lng2+Math.PI)%(2*Math.PI) - Math.PI;

	    // normalize to -180...+180
	    if (lat2 == 0 || lng2 == 0)
	    {
	        newLocation.setLatitude(0.0);
	        newLocation.setLongitude(0.0);
	    }
	    else
	    {
	        newLocation.setLatitude(Math.toDegrees(lat2));
	        newLocation.setLongitude(Math.toDegrees(lng2));
	    }

	    return newLocation;
	}

	/**
	 *
	 * @param is
	 * @param os
	 */
	public static void CopyStream(InputStream is, OutputStream os)
    {
        final int buffer_size=1024;
        try
        {
            byte[] bytes=new byte[buffer_size];
            for(;;)
            {
              int count=is.read(bytes, 0, buffer_size);
              if(count==-1)
                  break;
              os.write(bytes, 0, count);
            }
        }
        catch(Exception ex){}
    }

	/**
	 * Set typeface
	 * @return
	 */
	public static Typeface setTypeface(Context context)
	{
		if(context.getString(R.string.app_name).equals("Opinion It"))
		{
			Typeface face=Typeface.createFromAsset(context.getAssets(), "fonts/arial.ttf");
			//Typeface newtypeface=Typeface.create(face, 1);
			return face;
		}else if(context.getString(R.string.app_name).equals("OpiniónMóvil"))
		{
			Typeface face=Typeface.createFromAsset(context.getAssets(), "fonts/OpenSans-Regular.ttf");
			//Typeface newtypeface=Typeface.create(face, 1);
			return face;
		}else
		{
			Typeface face=Typeface.create("Arial", 1);
			return face;
		}
	}

	/**
	 *
	 * @param fileName
	 * @return
	 */
	public static String getStringFromResource(String fileName, Context mContext) {
		AssetManager assetManager = mContext.getAssets();
		String val = null;

			InputStream in = null;
			try {
				in = assetManager.open(fileName);

				val=convertStreamToString(in);

			} catch (IOException e) {
				Utils.printLog("Datta", "Failed to copy asset file: ", 'e');
			}
		return val;

	}

	public static String convertStreamToString(InputStream is) {
	    java.util.Scanner s = new java.util.Scanner(is).useDelimiter("\\A");
	    return s.hasNext() ? s.next() : "";
	}


	/**
	 * This function is used to calculate the appropriate interval to submit LM data. 
	 * @param totalDuration
	 * @param frequency
	 * @return
	 */
	public static long getLMDataSubmitInterval(int totalDuration, int frequency)
	{
		long interval=0;
		
		int division=totalDuration/frequency;
		//Log.d("Datta","Total Duration:"+ totalDuration+"   Frequency:"+frequency+"   Division:"+division);
		
		if(division>600)
			interval =  600 * frequency * 1000;
		else
			interval =  (totalDuration-2) * 1000;
		
		//Log.d("Datta", "Interval to collect the data: "+interval);
		return interval;
	}

	public static boolean isWebSocketSupported(){
		if(Build.VERSION.SDK_INT < 21){
			return false;
		}
		return true;
	}

	public static File zipFiles(ArrayList<String> files, String zipFileName) {
		final int BUFFER = 80000;
		File outputFile=null;
		try {
			BufferedInputStream origin = null;
			FileOutputStream dest = new FileOutputStream(zipFileName);
			ZipOutputStream out = new ZipOutputStream(new BufferedOutputStream(dest));
			byte data[] = new byte[BUFFER];

			for (int i = 0; i < files.size(); i++) {
				FileInputStream fi = new FileInputStream(files.get(i));
				origin = new BufferedInputStream(fi, BUFFER);

				ZipEntry entry = new ZipEntry(files.get(i).substring(files.get(i).lastIndexOf("/") + 1));
				out.putNextEntry(entry);
				int count;

				while ((count = origin.read(data, 0, BUFFER)) != -1) {
					out.write(data, 0, count);
				}
				origin.close();
			}

			out.close();
			outputFile=new File(zipFileName);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return outputFile;
	}

	public static void sendEmail(Activity activity,Uri uri, String chooserTitle, String emailContent){

		Intent emailIntent = new Intent(Intent.ACTION_SEND);
		emailIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
		emailIntent.setType("plain/text");
	//	emailIntent.setClassName("com.google.android.gm", "com.google.android.gm.ComposeActivityGmail");

		emailIntent.putExtra(Intent.EXTRA_SUBJECT,
				"Export Data");

		// the attachment
		emailIntent .putExtra(Intent.EXTRA_STREAM, uri);

		emailIntent.putExtra(Intent.EXTRA_TEXT, emailContent);

		activity.startActivity(Intent.createChooser(emailIntent , chooserTitle));
	}

	public void exportDatabase(File databaseFile) throws  IOException{
		String dstPath = Environment.getExternalStorageDirectory() + File.separator + "myApp" + File.separator;
		File dst = new File(dstPath);
		exportFile(databaseFile, dst);
	}
	private File exportFile(File src, File dst) throws IOException {

		//if folder does not exist
		if (!dst.exists()) {
			if (!dst.mkdir()) {
				return null;
			}
		}

		String timeStamp = new SimpleDateFormat("yyyyMMdd_HHmmss").format(new Date());
		File expFile = new File(dst.getPath() + File.separator + "LocationResult" + timeStamp + ".sqlite");
		FileChannel inChannel = null;
		FileChannel outChannel = null;

		try {
			inChannel = new FileInputStream(src).getChannel();
			outChannel = new FileOutputStream(expFile).getChannel();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		}

		try {
			inChannel.transferTo(0, inChannel.size(), outChannel);
		} finally {
			if (inChannel != null)
				inChannel.close();
			if (outChannel != null)
				outChannel.close();
		}

		return expFile;
	}

	public static long getTimeInMillisecondsForTimeZone(String timeZone){
		TimeZone defaultTz = TimeZone.getDefault();
		TimeZone.setDefault(TimeZone.getTimeZone(timeZone));
		Calendar cal = Calendar.getInstance();
		long time = cal.getTimeInMillis();
		TimeZone.setDefault(defaultTz);
		return time;
	}

	public static String getUniqueDeviceId(Context activity) {
		String device_id = Settings.Secure.getString(
				activity.getContentResolver(), Settings.Secure.ANDROID_ID);
		if ((device_id == null) || (device_id.equals("9774d56d682e549c"))
				|| (device_id.length() < 15)) {
			device_id = new BigInteger(64, new SecureRandom()).toString(16);
		}
		//Log.d("Datta", device_id);
		return device_id;
	}
}

