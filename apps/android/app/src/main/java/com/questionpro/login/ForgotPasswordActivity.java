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

import androidx.fragment.app.DialogFragment;

import com.questionpro.service.ForgotPasswordService;
import com.questionpro.uiutils.Transition;
import com.questionpro.utils.StringUtil;
import com.questionpro.utils.Utils;
import com.questionpro.views.CustomButton;
import com.questionpro.views.CustomEditText;
import com.questionpro.views.CustomTextView;
import com.questionpro.whitelabelapps.R;
import com.questionpro.exception.InvalidCompanyCodeException;
import com.questionpro.exception.InvalidEmailPasswordException;
import com.questionpro.networktask.ErrorLoggedAsyncTask;

import static com.questionpro.whitelabelapps.R.id.helpActionProgress;

/**
 * Created by sachinsable on 18/08/16.
 */

public class ForgotPasswordActivity extends BaseLoginActivity {
    private View rootView;
    private String title;
    private CustomButton resetPasswordButton;
    private CustomEditText emailAddressText, companyCodeText;
    private CustomTextView invalidEmailPasswordText;
    private Animation shakeAnimation;
    private boolean hasCompanyCode = false;
    private ProgressBar resetPasswordProgress;


    @Override
    void onCreateInternal(Bundle savedInstance, RelativeLayout container) {
        rootView = View.inflate(this, R.layout.forgot_password_activity,null);
        resetPasswordButton=(CustomButton)rootView.findViewById(R.id.helpActionButton);
        resetPasswordButton.setEnabled(false);
        emailAddressText = (CustomEditText) rootView.findViewById(R.id.emailAddress);
        emailAddressText.setImeOptions(EditorInfo.IME_ACTION_NEXT);
        companyCodeText = (CustomEditText) rootView.findViewById(R.id.companyCode);

        shakeAnimation = AnimationUtils.loadAnimation(this, R.anim.shake_horizontal);
        invalidEmailPasswordText = (CustomTextView) rootView.findViewById(R.id.invalidEmailPassswordText);
        emailAddressText.addTextChangedListener(textWatcherEmailAddress);
        companyCodeText.addTextChangedListener(textWatcherCompanyCode);

        if(getResources().getBoolean(R.bool.required_company_code)){
            hasCompanyCode = true;
            companyCodeText.setVisibility(View.VISIBLE);
            companyCodeText.setImeOptions(EditorInfo.IME_ACTION_DONE);
            companyCodeText.setOnEditorActionListener(onEditorActionListener);
        }
        else{
            hasCompanyCode = false;
            companyCodeText.setVisibility(View.GONE);
            emailAddressText.setImeOptions(EditorInfo.IME_ACTION_DONE);
            emailAddressText.setOnEditorActionListener(onEditorActionListener);
        }
        resetPasswordProgress = (ProgressBar) rootView.findViewById(helpActionProgress);
        container.addView(rootView, new RelativeLayout.
                LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.MATCH_PARENT));
        resetPasswordButton.setOnClickListener(helpClickListener);
    }

    private void shakeEmailPassword(){
        emailAddressText.startAnimation(shakeAnimation);

    }

    View.OnClickListener helpClickListener  = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            startForgotPasswordProcess();

        }
    };

    private void startForgotPasswordProcess() {
        Utils.hideSoftKeyboard(emailAddressText);
        if(isValidLogin()) {
            resetPasswordButton.setEnabled(false);
            new ResetPasswordTask().execute();
        }
        else{
            invalidEmailPasswordText.setVisibility(View.VISIBLE);
            invalidEmailPasswordText.setText(R.string.login_all_fields_required);
            invalidEmailPasswordText.setTextColor(getResources().getColor(R.color.error_message_color));
        }
    }
    EditText.OnEditorActionListener onEditorActionListener = new TextView.OnEditorActionListener() {
        @Override
        public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                startForgotPasswordProcess();
                return true;
            }
            return false;
        }
    };
    private boolean isValidLogin(){
        String emailAddr=emailAddressText.getText().toString();

        if(StringUtil.isNotEmpty(emailAddr)) {
            if(hasCompanyCode){
                if(StringUtil.isEmpty(companyCodeText.getText().toString())){
                    return false;
                }
            }
            return true;
        }
        return false;
    }
    private void shakeCompanyCode(){
        companyCodeText.startAnimation(shakeAnimation);
    }
    TextWatcher textWatcherEmailAddress =new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            boolean validTextLength = hasCompanyCode?
                    (companyCodeText.getText().length()>0) : true;
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
    TextWatcher textWatcherCompanyCode =new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            boolean validTextLength = emailAddressText.getText().length()>0;

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
    String getViewTitle() {
        return getString(R.string.forgot_password);
    }

    @Override
    Class<?> getBackButtonClass() {
        return null;
    }

    @Override
    Transition getBackTransition() {
        return Transition.EXIT;
    }
    private class ResetPasswordTask extends ErrorLoggedAsyncTask<Void, Void, Object> {
        @Override
        protected void onPostExecute(Object o) {
            super.onPostExecute(o);
            resetPasswordProgress.setVisibility(View.GONE);
            resetPasswordButton.setEnabled(true);
            if(o instanceof Exception){
                ((Exception) o).printStackTrace();
                if(o instanceof InvalidEmailPasswordException){
                    shakeEmailPassword();
                }
                else if(o instanceof InvalidCompanyCodeException){
                    shakeCompanyCode();

                }
                invalidEmailPasswordText.setText(Html.fromHtml(((Exception) o).getMessage()));
                invalidEmailPasswordText.setVisibility(View.VISIBLE);
                invalidEmailPasswordText.setTextColor(getResources().getColor(R.color.error_message_color));

            }
            else{
                if(o instanceof String) {
                    Utils.showToastMessage(ForgotPasswordActivity.this, (String)o, Toast.LENGTH_LONG);
                }
                invalidEmailPasswordText.setVisibility(View.INVISIBLE);

                showOTPAlertDialog();
            }

        }

        @Override
        protected Object doInBackgroundInternal(Object... arg) throws Exception {
            String message = ForgotPasswordService.forgotPassword(emailAddressText.getText().toString(),
                    companyCodeText.getText().toString(), ForgotPasswordActivity.this);

            return message;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            resetPasswordProgress.setVisibility(View.VISIBLE);

        }
    }
    private void showOTPAlertDialog(){
        DialogFragment otpDialogFragment  = new OTPDialogFragment();
        Bundle arguments = new Bundle();
        arguments.putString("emailAddress", emailAddressText.getText().toString());
        arguments.putString("companyCode", companyCodeText.getText().toString());
        otpDialogFragment.setArguments(arguments);
        otpDialogFragment.show(getSupportFragmentManager(), "OTPAlert");
    }






}
