package com.questionpro.marketing;

import android.app.Activity;
import android.content.res.TypedArray;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentPagerAdapter;

import com.questionpro.whitelabelapps.R;

/**
 * Created by Wasim on 11-06-2015.
 */
public class ViewPagerAdapter extends FragmentPagerAdapter {

    private String[] mTitles;
    private String[] mTexts;
    private TypedArray mIcons;
    private Activity activity;
    private boolean wantToShowDividerLine;

    public ViewPagerAdapter(FragmentManager fm, Activity activity)  {
        super(fm);
        this.activity = activity;
        wantToShowDividerLine=activity.getResources().getBoolean(R.bool.ms_divider_want_to_show);
        mTitles = activity.getResources().getStringArray(R.array.ms_titles);
        mTexts = activity.getResources().getStringArray(R.array.ms_texts);
        mIcons = activity.getResources().obtainTypedArray(R.array.ms_icons);
    }

    @Override
    public Fragment getItem(int index) {

        IntroPageFragment introPageFragment1 = IntroPageFragment.newInstance(mTitles[index], mTexts[index],
                mIcons.getResourceId(index,-1),wantToShowDividerLine);
        return introPageFragment1;

    }

    @Override
    public int getCount() {

        return mTitles.length;
    }

}
