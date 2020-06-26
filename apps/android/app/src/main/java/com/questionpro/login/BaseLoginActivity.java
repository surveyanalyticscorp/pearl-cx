package com.questionpro.login;

import android.content.Intent;
import android.os.Bundle;
import android.view.MenuItem;
import android.view.View;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;

import com.questionpro.uiutils.Transition;
import com.questionpro.whitelabelapps.R;
import com.questionpro.home.ReactHomeActivity;

import java.util.Iterator;
import java.util.Map;

/**
 * Created by sachinsable on 18/08/16.
 */

public abstract class BaseLoginActivity extends AppCompatActivity {
    abstract void onCreateInternal(Bundle savedInstance, RelativeLayout container);
    abstract void onStartInternal();
    abstract String getViewTitle();
    abstract Class<?> getBackButtonClass();
    abstract Transition getBackTransition();
   // private ImageButton backButton;
    private TextView titleTextView;
    private Toolbar toolbar;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.base_login_activity);
        toolbar = (Toolbar) findViewById(R.id.toolbar);

        setSupportActionBar(toolbar);
        RelativeLayout cotainer = (RelativeLayout) findViewById(R.id.container);

        onCreateInternal(savedInstanceState,cotainer);

        getSupportActionBar().setDisplayHomeAsUpEnabled(true);

        setTitle(getViewTitle());
        toolbar.setNavigationOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });
    }

    protected void goToActivity(Class<?> activityClass, Transition transition){
        goToActivity(activityClass,null,transition);
    }

    protected void goToActivity(Class<?> activityClass, Map<String, String> parameters,
                                Transition transition){
        Intent intent = new Intent(this, activityClass);
        if(parameters!=null && !parameters.isEmpty()){
            Iterator<String> it = parameters.keySet().iterator();
            while (it.hasNext()){
                String key = it.next();
                intent.putExtra(key, parameters.get(key));
            }

        }
        if(activityClass.getCanonicalName().equalsIgnoreCase(ReactHomeActivity.class.getCanonicalName())) {
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            this.startActivity(intent);
            finish();
        }
        else{
            this.startActivity(intent);
        }
        overridePendingTransition(transition.getAnimationStart(),
                transition.getAnimationEnd());
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        return super.onOptionsItemSelected(item);
    }

    @Override
    public void onBackPressed() {

        if(getBackButtonClass()!=null){
            finish();
            goToActivity(getBackButtonClass(), Transition.EXIT);
        }
        else{
            finish();
            Transition transition = getBackTransition();
            if(transition!=null) {
                overridePendingTransition(transition.getAnimationStart(), transition.getAnimationEnd());
            }
        }
    }
}
