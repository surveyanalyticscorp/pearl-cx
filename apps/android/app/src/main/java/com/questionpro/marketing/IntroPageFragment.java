package com.questionpro.marketing;

import android.graphics.Typeface;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.TextView;

import androidx.fragment.app.Fragment;

import com.questionpro.views.CustomTextView;
import com.questionpro.whitelabelapps.R;

public class IntroPageFragment extends Fragment {

	protected static final long SPLASH_TIME = 2000;
	private CustomTextView contentText, contentTitle;
    private ImageView resourceImageView,dividerLine;
	private String titleText, messageText;
	private int resourceIcon;
	private boolean wantToShowDividerLine;

	private View layer;
	public static IntroPageFragment newInstance(String title, String message, int resource,boolean dividerLine) {

		IntroPageFragment pageFragment = new IntroPageFragment();
		Bundle bundle = new Bundle();
		bundle.putString("title", title);

		bundle.putString("message", message);

        bundle.putInt("icon", resource);

		bundle.putBoolean("dividerLine",dividerLine);
		pageFragment.setArguments(bundle);
		return pageFragment;
	}

	@Override
	public void onCreate(Bundle savedInstanceState) {

		super.onCreate(savedInstanceState);
		titleText = getArguments().getString("title");
		messageText = getArguments().getString("message");
		resourceIcon = getArguments().getInt("icon");
		wantToShowDividerLine=getArguments().getBoolean("dividerLine");
	}
	

	@Override
	public View onCreateView(LayoutInflater inflater, ViewGroup container,
			Bundle savedInstanceState) {

		View view = inflater.inflate(R.layout.pager_item, null);

		contentText = (CustomTextView) view.findViewById(R.id.msText);
		contentTitle=(CustomTextView) view.findViewById(R.id.msTitle);
        resourceImageView=(ImageView)view.findViewById(R.id.msIcon);
		dividerLine=(ImageView)view.findViewById(R.id.ms_divider_line);

		return view;
	}

    @Override
    public void onActivityCreated(Bundle savedInstanceState) {
        super.onActivityCreated(savedInstanceState);
        contentText.setText(messageText);
        contentTitle.setText(titleText, TextView.BufferType.NORMAL, Typeface.BOLD);
		if(resourceIcon == R.drawable.arrow_up){
			((LinearLayout)resourceImageView.getParent()).setVisibility(View.GONE);
		}
        resourceImageView.setImageResource(resourceIcon);
		if(wantToShowDividerLine)
			dividerLine.setVisibility(View.VISIBLE);
    }

    @Override
	public void onSaveInstanceState(Bundle outState) {

		super.onSaveInstanceState(outState);
		setUserVisibleHint(true);
	}


}
