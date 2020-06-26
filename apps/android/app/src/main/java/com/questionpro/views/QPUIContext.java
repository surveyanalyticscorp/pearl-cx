package com.questionpro.views;

import android.content.Context;
import android.graphics.Typeface;

/**
 * Created by sachinsable on 12/10/16.
 */

public class QPUIContext {

    private QPUIContext(){


    }

    private static QPUIContext qpuiContextInstance = null;

    public static QPUIContext getInstance(){
        if(qpuiContextInstance == null){
            qpuiContextInstance = new QPUIContext();

        }
        return  qpuiContextInstance;
    }
    private Typeface customTypefaceBold = null;
    private Typeface customTypefaceNormal = null;
    private Typeface customTypefaceLight = null;


    public void initTypeface(Context baseContext) {
        if (customTypefaceBold == null || customTypefaceNormal == null || customTypefaceLight == null) {
            customTypefaceBold = Typeface.createFromAsset(baseContext.getAssets(), "fonts/ProximaNovaA-Bold.otf");
            customTypefaceNormal = Typeface.createFromAsset(baseContext.getAssets(), "fonts/ProximaNova-Regular.otf");
            customTypefaceLight = Typeface.createFromAsset(baseContext.getAssets(), "fonts/ProximaNova-Light.otf");
        }
    }
    public Typeface getCustomTypeFace(int type) {
        Typeface customTypeFace = Typeface.DEFAULT;
        switch (type) {
            case Typeface.BOLD:
                customTypeFace = customTypefaceBold;

                break;
            case Typeface.NORMAL:
                customTypeFace = customTypefaceNormal;

                break;
            case Typeface.ITALIC:
                customTypeFace = customTypefaceLight;

                break;
            default:
                break;
        }
        return customTypeFace;
    }
}
