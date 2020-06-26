package com.questionpro.marketing;

import android.content.Intent;
import android.content.res.Configuration;
import android.os.Bundle;
import android.util.DisplayMetrics;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.TranslateAnimation;
import android.widget.ImageView;
import android.widget.LinearLayout;

import androidx.fragment.app.FragmentActivity;
import androidx.viewpager.widget.ViewPager;

import com.questionpro.login.CompanyCodeActivity;
import com.questionpro.login.LoginActivity;
import com.questionpro.login.SocialLoginActivity;
import com.questionpro.uiutils.Transition;
import com.questionpro.views.CustomButton;
import com.questionpro.views.QPUIContext;
import com.questionpro.whitelabelapps.R;

public class MarketingActivity extends FragmentActivity implements ViewPager.OnPageChangeListener, View.OnClickListener {
    private final int MARGIN = 8;

    private CustomButton getStarted;
    private ViewPager intro_images;
    private LinearLayout pager_indicator;
    private int dotsCount;
    private ImageView[] dots;
    private ViewPagerAdapter mAdapter;
    boolean wentToLast = false;
    int selectedPosition = 0;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
                WindowManager.LayoutParams.FLAG_FULLSCREEN);
        QPUIContext.getInstance().initTypeface(this);
        setContentView(R.layout.marketing_activity);
        intro_images = (ViewPager) findViewById(R.id.pager_introduction);
        getStarted=(CustomButton) findViewById(R.id.getStarted);
        getStarted.setOnClickListener(this);
        pager_indicator = (LinearLayout)findViewById(R.id.viewPagerCountDots);


        mAdapter = new ViewPagerAdapter(getSupportFragmentManager(), this);
        intro_images.setAdapter(mAdapter);

        intro_images.setCurrentItem(0);
        intro_images.setOnPageChangeListener(this);
        setUiPageViewController();
        intro_images.setOffscreenPageLimit(dotsCount);
        if(savedInstanceState!=null){
            selectedPosition = savedInstanceState.getInt("Position");
            intro_images.setCurrentItem(selectedPosition);
            if(selectedPosition==dotsCount-1){
                moveViewToLeft(pager_indicator);
            }
        }
    }


    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        if (dots.length - 1 == selectedPosition) {
            handleLastToPreviousPage();

            findViewById(android.R.id.content).postDelayed(new Runnable() {
                @Override
                public void run() {
                    handleLastPage();
                }
            }, 100);
        }
    }

    private void setUiPageViewController() {

        dotsCount = mAdapter.getCount();
        dots = new ImageView[dotsCount];

        for (int i = 0; i < dotsCount; i++) {
            dots[i] = new ImageView(this);
            dots[i].setImageDrawable(getResources().getDrawable(R.drawable.nonselecteditem_dot));

            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT
            );

            params.setMargins(MARGIN, 0, MARGIN, 0);

            pager_indicator.addView(dots[i], params);
        }

        dots[0].setImageDrawable(getResources().getDrawable(R.drawable.selecteditem_dot));
    }




    @Override
    public void onClick(View v) {
        if(v.getId() == R.id.getStarted){
            //finish();
            if(getResources().getBoolean(R.bool.has_social_auth_login)){
                startActivity(new Intent(this, SocialLoginActivity.class));
            }else if(getResources().getBoolean(R.bool.has_company_code_screen)){
                startActivity(CompanyCodeActivity.getLaunchActivityIntent(MarketingActivity.this));
            } else{
                startActivity(new Intent(this, LoginActivity.class));
            }

            overridePendingTransition(Transition.ENTER.getAnimationStart(), Transition.ENTER.getAnimationEnd());
        }
    }

    @Override
    public void onPageScrolled(int position, float positionOffset, int positionOffsetPixels) {


    }


    @Override
    public void onPageSelected(int position) {
        selectedPosition = position;
        for (int i = 0; i < dotsCount; i++) {
            dots[i].setImageDrawable(getResources().getDrawable(R.drawable.nonselecteditem_dot));
        }
        dots[position].setImageDrawable(getResources().getDrawable(R.drawable.selecteditem_dot));
        if(position==dotsCount-1){
            handleLastPage();
        }
        else if(wentToLast && position==dotsCount-2){
            handleLastToPreviousPage();
        }


    }

    private void handleLastPage(){
        wentToLast = true;
        moveViewToLeft(pager_indicator);
        moveViewRightToLeft(getStarted);
        getStarted.setVisibility(View.VISIBLE);
    }

    private void handleLastToPreviousPage(){
        wentToLast=false;
        moveViewToOriginalPos(pager_indicator);
        moveViewLeftToRight(getStarted);
        getStarted.setVisibility(View.GONE);
    }

    @Override
    public void onPageScrollStateChanged(int state) {

    }

    private void moveViewToLeft(View view )
    {
        //Log.d("Sachin", "Moving View");
        float xDest = 0;
        ViewGroup viewGroup = (ViewGroup) view;

        xDest = viewGroup.getChildAt(0).getX();
        TranslateAnimation anim = new TranslateAnimation( 0, -xDest+40 , 0, 0 );
        anim.setDuration(400);
        anim.setFillAfter( true );
        view.startAnimation(anim);
    }

    private void moveViewRightToLeft(View view){
        DisplayMetrics dm = new DisplayMetrics();
        this.getWindowManager().getDefaultDisplay().getMetrics( dm );
        int fromX = dm.widthPixels;
        TranslateAnimation anim = new TranslateAnimation( fromX, 0 , 0, 0 );
        anim.setDuration(400);
        anim.setFillAfter( true );
        view.startAnimation(anim);
    }

    private void moveViewToOriginalPos(View view){
        ViewGroup viewGroup = (ViewGroup) view;
        TranslateAnimation anim = new TranslateAnimation( 0, 0 , 0, 0 );
        anim.setDuration(1000);
        anim.setFillAfter( true );
        view.startAnimation(anim);

    }

    private void moveViewLeftToRight(View view){
        DisplayMetrics dm = new DisplayMetrics();
        this.getWindowManager().getDefaultDisplay().getMetrics( dm );
        int fromX = dm.widthPixels;
        TranslateAnimation anim = new TranslateAnimation( 0, fromX , 0, 0 );
        anim.setDuration(400);
        anim.setFillAfter( false );
        view.startAnimation(anim);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        outState.putInt("Position", selectedPosition);
        super.onSaveInstanceState(outState);
    }
}
