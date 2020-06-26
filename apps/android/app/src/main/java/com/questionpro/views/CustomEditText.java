package com.questionpro.views;

import android.content.Context;
import android.graphics.Typeface;
import android.util.AttributeSet;
import android.widget.EditText;

import java.util.Hashtable;

/**
 * Created by sachinsable on 06/12/16.
 */

public class CustomEditText extends EditText {
    private Context context;
    private Typeface customTypeFace;
    private QPUIContext qpuiContext ;
    private static Typeface tf;
    private static final Hashtable<String, Typeface> cache = new Hashtable<String, Typeface>();


    public CustomEditText(Context context, AttributeSet attrs) {
        super(context, attrs);

        this.context = context;
        int typeface = attrs.getAttributeIntValue("http://schemas.android.com/apk/res/android", "textStyle", 0);
        setCustomTypeFace(typeface);
        isInEditMode();
        setSaveEnabled(true);

    }

    public CustomEditText(Context context) {
        super(context);

        this.context = context;
        setCustomTypeFace(Typeface.NORMAL);
        isInEditMode();

        setSaveEnabled(true);
    }

    public void setText(CharSequence text, BufferType type) {

        super.setText(text, type);

        setCustomTypeFace(Typeface.NORMAL);

    }

    public void setText(CharSequence text, BufferType type, int textStyle) {

        super.setText(text, type);

        setCustomTypeFace(textStyle);

    }


    public void setCustomTypeFace(int type){
        qpuiContext= QPUIContext.getInstance();
        setTypeface(qpuiContext.getCustomTypeFace(type));

    }
}
