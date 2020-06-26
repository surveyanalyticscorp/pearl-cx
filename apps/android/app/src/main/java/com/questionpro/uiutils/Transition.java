package com.questionpro.uiutils;

import com.questionpro.whitelabelapps.R;

public class Transition {

	public static final Transition ENTER=new Transition(R.anim.slide_in_right ,R.anim.slide_out_left);
	public static final Transition EXIT = new Transition(R.anim.slide_in_left,R.anim.activity_close_translate);
	
	private int animEnd;
	private int animStart;	
	
	public Transition(int animStart, int animEnd) {
		this.animStart = animStart;
		this.animEnd = animEnd;
	}
	
	public int getAnimationStart() {
		return animStart;
	}
	public int getAnimationEnd() {
		return animEnd;		
	}
}
