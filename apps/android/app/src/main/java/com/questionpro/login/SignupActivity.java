package com.questionpro.login;

import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.Html;
import android.text.TextWatcher;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.ProgressBar;
import android.widget.Toast;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import com.questionpro.home.ReactHomeActivity;
import com.questionpro.uiutils.Transition;
import com.questionpro.utils.StringUtil;
import com.questionpro.utils.Utils;
import com.questionpro.views.CustomButton;
import com.questionpro.views.CustomEditText;
import com.questionpro.views.CustomTextView;
import com.questionpro.whitelabelapps.R;

import java.util.ArrayList;

/**
 * Created by sachinsable on 10/3/17.
 */

public class SignupActivity extends AppCompatActivity implements View.OnClickListener, SignupTask.SignupListener {
    private CustomEditText firstNameText, lastNameText,emailAddressText, passwordText,confirmPasswordText, companyCodeText;

    private CustomButton registerButton;

    private CustomTextView invalidEmailPasswordText, loginButton;
    private ImageButton  backButton;
    private View contentView;
    private ProgressBar signInProgress;
    private boolean hasCompanyCode;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        contentView = LayoutInflater.from(this).inflate(R.layout.signup_activity, null);
        setContentView(contentView);
        ActionBar actionBar = getSupportActionBar();
        actionBar.setDisplayHomeAsUpEnabled(true);



        setTitle("");
        invalidEmailPasswordText = (CustomTextView)findViewById(R.id.invalidEmailPassswordText);
        firstNameText = (CustomEditText) findViewById(R.id.firstName);
        lastNameText = (CustomEditText) findViewById(R.id.lastName);
        emailAddressText = (CustomEditText) findViewById(R.id.emailAddress);
        passwordText = (CustomEditText) findViewById(R.id.password);
        signInProgress = (ProgressBar) findViewById(R.id.signInProgress);
        confirmPasswordText = (CustomEditText) findViewById(R.id.confirmPassword);
        companyCodeText = (CustomEditText) findViewById(R.id.companyCode);
        hasCompanyCode = getResources().getBoolean(R.bool.required_company_code);
        companyCodeText.setVisibility(hasCompanyCode ?
                View.VISIBLE :
                View.GONE);
        registerButton = (CustomButton) findViewById(R.id.registerButton);
        registerButton.setOnClickListener(this);
        registerButton.setEnabled(false);
        loginButton = (CustomTextView) findViewById(R.id.loginButton);
        loginButton.setOnClickListener(this);
        ArrayList<EditText> editTextsList = new ArrayList<EditText>();
        editTextsList.add(firstNameText);
        editTextsList.add(lastNameText);
        editTextsList.add(emailAddressText);
        editTextsList.add(passwordText);
        editTextsList.add(confirmPasswordText);
        if(hasCompanyCode){
            editTextsList.add(companyCodeText);
        }
        CustomTextWatcher textWatcher = new CustomTextWatcher(editTextsList, registerButton);
        for (EditText editText : editTextsList) editText.addTextChangedListener(textWatcher);

    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.loginButton) {
            onBackPressed();
        } else if (v.getId() == R.id.registerButton) {
            if(isFormValid()){
                startSignupProcess();
            }
        }
    }
    private boolean isFormValid(){
        if(StringUtil.isEmpty(firstNameText.getText().toString())
                || StringUtil.isEmpty(lastNameText.getText().toString())
                || StringUtil.isEmpty(emailAddressText.getText().toString())
                || StringUtil.isEmpty(passwordText.getText().toString())
                || (hasCompanyCode && StringUtil.isEmpty(companyCodeText.getText().toString()))
                ){
            Utils.showToastMessage(this,"All fields are mandatory.", Toast.LENGTH_SHORT);
            return false;
        }
        else if(!Utils.isValidEmail(emailAddressText.getText().toString())){
            Utils.showToastMessage(this,"Please enter a valid email address",Toast.LENGTH_SHORT);
            emailAddressText.requestFocus();
            return false;
        }
        else if(!passwordText.getText().toString().equals(confirmPasswordText.getText().toString())){
            Utils.showToastMessage(this,"Password and Confirm Password don't match", Toast.LENGTH_SHORT);
            confirmPasswordText.requestFocus();
            return false;
        }
        else {
            return true;
        }
    }

    @Override
    public void onBackPressed() {
        super.onBackPressed();
        overridePendingTransition(R.anim.slide_out_bottom, R.anim.slide_in_top);
    }
    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        switch (item.getItemId()) {
            case android.R.id.home:
                onBackPressed();
                return true;
            default:
                return super.onOptionsItemSelected(item);
        }
    }

    @Override
    public void onSignupSuccess(String status) {
        signInProgress.setVisibility(View.GONE);
        invalidEmailPasswordText.setVisibility(View.INVISIBLE);
        if(status.equalsIgnoreCase("verified")){
            Intent intent = new Intent(SignupActivity.this, ReactHomeActivity.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
            intent.putExtra("FromLogin", true);
            startActivity(intent);
            overridePendingTransition(Transition.ENTER.getAnimationStart(), Transition.ENTER.getAnimationEnd());
        }
        else{
            Utils.showToastMessage(this.getApplicationContext(),
                    "Account has been created successfully. Please check your inbox for the verification email.", Toast.LENGTH_LONG);
        }
        onBackPressed();
    }

    @Override
    public void onSignupError(Exception e) {
        e.printStackTrace();
        signInProgress.setVisibility(View.GONE);
        invalidEmailPasswordText.setText(Html.fromHtml((e.getMessage())));
        invalidEmailPasswordText.setVisibility(View.VISIBLE);
        invalidEmailPasswordText.setTextColor(getResources().getColor(R.color.error_message_color));

    }

    @Override
    public void onPreExecute() {
        signInProgress.setVisibility(View.VISIBLE);
    }
    private void startSignupProcess() {
        Utils.hideSoftKeyboard(passwordText);
        invalidEmailPasswordText.setVisibility(View.INVISIBLE);
        if (isFormValid()) {

            new SignupTask(this, this,firstNameText.getText().toString(),
                    lastNameText.getText().toString(),
                    emailAddressText.getText().toString(),
                    passwordText.getText().toString(),
                    companyCodeText.getText().toString()).execute();
        } else {
            invalidEmailPasswordText.setVisibility(View.VISIBLE);
            invalidEmailPasswordText.setText(R.string.login_all_fields_required);
            invalidEmailPasswordText.setTextColor(getResources().getColor(R.color.error_message_color));
        }
    }
    public class CustomTextWatcher implements TextWatcher {

        View v;
        ArrayList<EditText> edList;

        public CustomTextWatcher(ArrayList<EditText> edList, View v) {
            this.v = v;
            this.edList = edList;
        }

        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {}

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {}

        @Override
        public void afterTextChanged(Editable s) {
            for (EditText editText : edList) {
                if (editText.getText().toString().trim().length() <= 0) {
                    v.setEnabled(false);
                    break;
                }
                else v.setEnabled(true);
            }
        }
    }
}
