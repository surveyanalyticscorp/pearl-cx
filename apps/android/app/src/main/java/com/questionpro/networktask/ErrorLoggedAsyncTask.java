package com.questionpro.networktask;

import android.os.AsyncTask;

public abstract class ErrorLoggedAsyncTask<Params, Progress, Result> extends AsyncTask<Params, Progress, Result> {

	protected abstract Object doInBackgroundInternal(Object... arg) throws Exception;
	
	@Override
	protected  Object doInBackground(Object... arg0) {
		try {
			/*Looper.prepare();
			Looper.loop();*/
			return doInBackgroundInternal(arg0);
		} catch (Throwable t) {
			//
			return t;
		}			
		
	}

}
