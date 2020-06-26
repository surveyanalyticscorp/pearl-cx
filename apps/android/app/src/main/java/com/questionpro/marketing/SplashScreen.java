package com.questionpro.marketing;

import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.view.Window;
import android.view.WindowManager;

import com.questionpro.app.CoreApplication;
import com.questionpro.home.ReactHomeActivity;
import com.questionpro.model.AppUser;
import com.questionpro.uiutils.Transition;
import com.questionpro.whitelabelapps.R;

/**
 * Created by sachinsable on 23/08/16.
 */

public class SplashScreen extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        setContentView(R.layout.splash_screen);

        new LoadData().execute();

    }


    private class LoadData extends AsyncTask<Void, Void, Void>{
        @Override
        protected Void doInBackground(Void... params) {

            try{
                Thread.sleep(2000);
            }
            catch (Exception e){
                e.printStackTrace();
            }
            return null;
        }

        @Override
        protected void onPostExecute(Void aVoid) {
            super.onPostExecute(aVoid);
            Intent i ;
            if(!AppUser.isLoggedIn(CoreApplication.getContext())){
                i = new Intent(SplashScreen.this, MarketingActivity.class);
            }else {
                SharedPreferences force_pref = PreferenceManager.getDefaultSharedPreferences(getBaseContext().getApplicationContext());
                String language = force_pref.getString(CoreApplication.FORCE_LOCAL, "en");
                CoreApplication.updateLanguage(CoreApplication.getContext(),language);
                i = new Intent(SplashScreen.this, ReactHomeActivity.class);
            }
            finish();
            startActivity(i);
            overridePendingTransition(Transition.ENTER.getAnimationStart(), Transition.ENTER.getAnimationEnd());
        }
    }


}
