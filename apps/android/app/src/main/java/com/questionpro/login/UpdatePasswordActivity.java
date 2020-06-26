package com.questionpro.login;

import android.os.Bundle;
import android.text.Editable;
import android.text.Html;
import android.text.TextWatcher;
import android.view.KeyEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.questionpro.service.ForgotPasswordService;
import com.questionpro.uiutils.Transition;
import com.questionpro.utils.StringUtil;
import com.questionpro.utils.Utils;
import com.questionpro.views.CustomButton;
import com.questionpro.views.CustomEditText;
import com.questionpro.views.CustomTextView;
import com.questionpro.whitelabelapps.R;
import com.questionpro.networktask.ErrorLoggedAsyncTask;

import static com.questionpro.whitelabelapps.R.id.helpActionProgress;

/**
 * Created by sachinsable on 16/12/16.
 */

public class UpdatePasswordActivity extends BaseLoginActivity {
    private View rootView;
    private String title;
    private String emailAddress, companyCode;
    private CustomButton resetPasswordButton;
    private CustomEditText passwordText, confirmPasswordText;
    private CustomTextView invalidEmailPasswordText;
    private Animation shakeAnimation;
    private boolean hasCompanyCode = false;
    private ProgressBar resetPasswordProgress;
    @Override
    void onCreateInternal(Bundle savedInstance, RelativeLayout container) {
        rootView = View.inflate(this, R.layout.update_password_activity,null);
        emailAddress = getIntent().getStringExtra("emailAddress");
        companyCode = getIntent().getStringExtra("companyCode");
        resetPasswordButton=(CustomButton)rootView.findViewById(R.id.updatePasswordButton);
        resetPasswordButton.setEnabled(false);
        passwordText = (CustomEditText) rootView.findViewById(R.id.password);
        passwordText.setImeOptions(EditorInfo.IME_ACTION_NEXT);
        shakeAnimation = AnimationUtils.loadAnimation(this, R.anim.shake_horizontal);
        invalidEmailPasswordText = (CustomTextView) rootView.findViewById(R.id.invalidEmailPassswordText);
        confirmPasswordText= (CustomEditText)rootView.findViewById(R.id.confirmPassword);
        confirmPasswordText.setImeOptions(EditorInfo.IME_ACTION_DONE);
        confirmPasswordText.setOnEditorActionListener(onEditorActionListener);
        passwordText.addTextChangedListener(textWatcherPassword);
        confirmPasswordText.addTextChangedListener(textWatcherConfirmPassword);
        resetPasswordProgress = (ProgressBar) rootView.findViewById(helpActionProgress);
        container.addView(rootView, new RelativeLayout.
                LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
        resetPasswordButton.setOnClickListener(helpClickListener);

    }


    View.OnClickListener helpClickListener  = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            startUpdatePasswordProcess();
        }
    };

    private void startUpdatePasswordProcess() {
        Utils.hideSoftKeyboard(confirmPasswordText);
        if(StringUtil.isEmpty(passwordText.getText().toString())  && StringUtil.isEmpty(passwordText.getText().toString())){
            invalidEmailPasswordText.setText("Please enter the new password.");
            invalidEmailPasswordText.setVisibility(View.VISIBLE);
            invalidEmailPasswordText.setTextColor(getResources().getColor(R.color.error_message_color));
        }
        else if(passwordText.getText().toString().equals(confirmPasswordText.getText().toString())) {
            resetPasswordButton.setEnabled(false);
            new UpdatePasswordTask().execute();
        }
        else{
            invalidEmailPasswordText.setText("Password and Confirm Password do not match.");
            invalidEmailPasswordText.setVisibility(View.VISIBLE);
            invalidEmailPasswordText.setTextColor(getResources().getColor(R.color.error_message_color));
        }
    }


    TextWatcher textWatcherPassword =new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            boolean validTextLength =
                    (confirmPasswordText.getText().length()>0);
            if(s.length()>0 && validTextLength){
                resetPasswordButton.setEnabled(true);
            }
            else{
                resetPasswordButton.setEnabled(false);
            }
        }

        @Override
        public void afterTextChanged(Editable s) {

        }
    };
    EditText.OnEditorActionListener onEditorActionListener = new TextView.OnEditorActionListener() {
        @Override
        public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                startUpdatePasswordProcess();
                return true;
            }
            return false;
        }
    };

    TextWatcher textWatcherConfirmPassword =new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            boolean validTextLength =
                    (passwordText.getText().length()>0);
            if(s.length()>0 && validTextLength){
                resetPasswordButton.setEnabled(true);
            }
            else{
                resetPasswordButton.setEnabled(false);
            }
        }

        @Override
        public void afterTextChanged(Editable s) {

        }
    };

    @Override
    void onStartInternal() {

    }

    @Override
    Class<?> getBackButtonClass() {
        return null;
    }

    @Override
    Transition getBackTransition() {
        return Transition.EXIT;
    }

    @Override
    String getViewTitle() {
        return "Update Password";
    }
    private class UpdatePasswordTask extends ErrorLoggedAsyncTask<Void, Void, Object> {
        @Override
        protected void onPostExecute(Object o) {
            super.onPostExecute(o);
            resetPasswordProgress.setVisibility(View.GONE);
            resetPasswordButton.setEnabled(true);
            if(o instanceof Exception){
                ((Exception) o).printStackTrace();

                invalidEmailPasswordText.setText(Html.fromHtml(((Exception) o).getMessage()));
                invalidEmailPasswordText.setVisibility(View.VISIBLE);
                invalidEmailPasswordText.setTextColor(getResources().getColor(R.color.error_message_color));

            }
            else{
                if(o instanceof String) {
                    Utils.showToastMessage(UpdatePasswordActivity.this, (String)o, Toast.LENGTH_LONG);
                }
                invalidEmailPasswordText.setVisibility(View.INVISIBLE);
                finish();
                //goToActivity(LoginActivity.class, Transition.ENTER);
            }

        }

        @Override
        protected Object doInBackgroundInternal(Object... arg) throws Exception {
            String message = ForgotPasswordService.updatePassword(emailAddress,companyCode,
                    passwordText.getText().toString(), UpdatePasswordActivity.this);

            return message;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            resetPasswordProgress.setVisibility(View.VISIBLE);

        }
    }
}
