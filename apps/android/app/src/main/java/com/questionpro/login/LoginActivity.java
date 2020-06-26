package com.questionpro.login;


import android.app.Dialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.text.Editable;
import android.text.Html;
import android.text.TextWatcher;
import android.text.method.LinkMovementMethod;
import android.text.method.PasswordTransformationMethod;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.MenuItem;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.TextView;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;

import com.questionpro.home.ReactHomeActivity;
import com.questionpro.model.AppUser;
import com.questionpro.uiutils.Transition;
import com.questionpro.utils.StringUtil;
import com.questionpro.utils.Utils;
import com.questionpro.views.CustomButton;
import com.questionpro.views.CustomEditText;
import com.questionpro.views.CustomTextView;
import com.google.android.gms.analytics.Tracker;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.questionpro.whitelabelapps.R;
import com.questionpro.app.CoreApplication;
import com.questionpro.exception.InvalidCompanyCodeException;
import com.questionpro.exception.InvalidEmailPasswordException;
import com.questionpro.marketing.MarketingActivity;

import java.util.List;

/**
 * Created by sachinsable on 18/08/16.
 */

public class LoginActivity extends AppCompatActivity implements View.OnClickListener,
        GoogleApiClient.OnConnectionFailedListener, LoginTask.LoginListener {

    private CustomEditText emailAddressText, passwordText, companyCodeText;
    private RelativeLayout companyCodeLayout;
    private CustomButton signInButton;

    private CustomTextView invalidEmailPasswordText, forgotPasswordButton;
    private ImageButton showPassword, whatIsCompanyCode, backButton;

    private ProgressBar signInProgress;
    private Animation shakeAnimation;
    private boolean hasCompanyCode;
    private View contentView;
    private GoogleSignInOptions gso;
    private GoogleApiClient mGoogleApiClient;
    private int RC_GOOGLE_SIGN_IN = 10;
    private int RC_SLACK_SIGN_IN = 20;
    private final String TAG = "LoginActivity";
    private AuthenticationManager mAuthContext;
    private Tracker tracker;
    private boolean hasSignup;
    private CustomTextView joinNowButton;
    private LinearLayout joinNowLayout;
    private String companyCode;

    @Override
    public void onCreate(Bundle savedInstance) {
        super.onCreate(savedInstance);
        AppUser appUser = AppUser.loadFromContext(CoreApplication.getContext());
        Intent intent = getIntent();
        boolean showCompanyCode = true;


        if (appUser != null) {
            String action = intent.getAction();

            Uri data = intent.getData();
            if (action != null && data != null && action.equals(Intent.ACTION_VIEW) ) {
                //Came from sign up url
                List<String> list = data.getPathSegments();
                String lastSegment = list.get(list.size()-1);
                //fetch the panel member id from url
                long id = Long.parseLong(lastSegment.substring(0, lastSegment.indexOf('-')));
                if(id == appUser.ID){
                    Intent i = new Intent(LoginActivity.this, ReactHomeActivity.class);
                    i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
                    i.putExtra("FromLogin", false);
                    startActivity(i);
                    overridePendingTransition(Transition.ENTER.getAnimationStart(), Transition.ENTER.getAnimationEnd());
                    finish();
                }
                else{
                    //Log out the current user
                    AppUser.clearSavedUserData(CoreApplication.getContext(),true);
                    CoreApplication.clearLanguagePreference();
                }
            }
        }
        contentView = LayoutInflater.from(this).inflate(R.layout.login_activity, null);
        setContentView(contentView);
        ActionBar actionBar = getSupportActionBar();
        actionBar.setDisplayHomeAsUpEnabled(true);


        setTitle("");

        emailAddressText = (CustomEditText) findViewById(R.id.emailAddress);
        String savedEmail = AppUser.getUserEmailFromContext(CoreApplication.getContext());
        if (StringUtil.isNotEmpty(savedEmail)) {
            emailAddressText.setText(savedEmail);
            emailAddressText.setSelection(savedEmail.length());
        }
       // emailAddressText.setText("sachin.sable@questionpro.com");
        companyCodeLayout = (RelativeLayout) findViewById(R.id.companyCodeLayout);
        hasCompanyCode = getResources().getBoolean(R.bool.required_company_code);
        companyCodeLayout.setVisibility(hasCompanyCode ?
                View.VISIBLE :
                View.GONE);
        passwordText = (CustomEditText) findViewById(R.id.password);
       // passwordText.setText("sachin123");
        companyCodeText = (CustomEditText) findViewById(R.id.companyCode);
        signInButton = (CustomButton) findViewById(R.id.signInButton);


        signInButton.setEnabled(false);
        signInButton.setOnClickListener(this);
        forgotPasswordButton = (CustomTextView) findViewById(R.id.forgotPasswordButton);
        forgotPasswordButton.setOnClickListener(this);
        shakeAnimation = AnimationUtils.loadAnimation(this, R.anim.shake_horizontal);
        invalidEmailPasswordText = (CustomTextView) findViewById(R.id.invalidEmailPassswordText);
        showPassword = (ImageButton) findViewById(R.id.showPasswordCheck);


        showPassword.setTag(0);
        whatIsCompanyCode = (ImageButton) findViewById(R.id.whatIsCompanyCode);
        if (hasCompanyCode) {
            passwordText.setImeOptions(EditorInfo.IME_ACTION_NEXT);
            companyCodeText.setOnEditorActionListener(onEditorActionListener);

        } else {
            passwordText.setImeOptions(EditorInfo.IME_ACTION_DONE);
            passwordText.setOnEditorActionListener(onEditorActionListener);
        }
        emailAddressText.addTextChangedListener(textWatcherEmailAddress);
        passwordText.addTextChangedListener(textWatcherPassword);
        companyCodeText.addTextChangedListener(textWatcherCompanyCode);
        showPassword.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if (showPassword.getTag().equals(0)) {
                    passwordText.setTransformationMethod(null);
                    showPassword.setImageDrawable(getResources().getDrawable(R.drawable.hide_password_icon));
                    showPassword.setTag(1);
                } else {
                    passwordText.setTransformationMethod(new PasswordTransformationMethod());
                    showPassword.setImageDrawable(getResources().getDrawable(R.drawable.show_password_icon));
                    showPassword.setTag(0);
                }
                if (passwordText.hasFocus() && passwordText.getText() != null) {
                    passwordText.setSelection(passwordText.getText().toString().length());
                }
            }
        });
        whatIsCompanyCode.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showPopupWindow();
            }
        });
        signInProgress = (ProgressBar) findViewById(R.id.signInProgress);

        hasSignup = getResources().getBoolean(R.bool.has_signup);
        joinNowLayout = (LinearLayout) findViewById(R.id.joinNowLayout);
        joinNowButton = (CustomTextView) findViewById(R.id.joinNowButton);
        if (hasSignup) {
            joinNowLayout.setVisibility(View.VISIBLE);
            joinNowButton.setOnClickListener(this);
        } else {
            joinNowLayout.setVisibility(View.GONE);
        }

        if(intent != null && intent.hasExtra("SHOW_COMPANY_CODE") && intent.hasExtra("COMPANY_CODE")){
            showCompanyCode = intent.getBooleanExtra("SHOW_COMPANY_CODE", true);
            companyCode = intent.getStringExtra("COMPANY_CODE");
            companyCodeText.setText(companyCode);
            if(!showCompanyCode){
                //disable company code layout if the company has company code for CX module
                companyCodeLayout.setVisibility(View.GONE);
                passwordText.setImeOptions(EditorInfo.IME_ACTION_DONE);
                passwordText.setOnEditorActionListener(onEditorActionListener);
            }
            else {
                companyCodeLayout.setVisibility(View.VISIBLE);
                passwordText.setImeOptions(EditorInfo.IME_ACTION_NEXT);
                companyCodeText.setImeOptions(EditorInfo.IME_ACTION_DONE);
            }


        }


    }


    EditText.OnEditorActionListener onEditorActionListener = new TextView.OnEditorActionListener() {
        @Override
        public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                startLoginProcess();
                return true;
            }
            return false;
        }
    };

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {

    }

    @Override
    public void onBackPressed() {
        finish();
        if (getIntent().getBooleanExtra("LoggedOut", false)) {
            if (getResources().getBoolean(R.bool.has_social_auth_login)) {
                Intent intent = new Intent(this, SocialLoginActivity.class);
                intent.putExtras(getIntent().getExtras());
                startActivity(intent);
            } else {
                startActivity(new Intent(this, MarketingActivity.class));
            }
        }
        overridePendingTransition(Transition.EXIT.getAnimationStart(), Transition.EXIT.getAnimationEnd());
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
    public void onStart() {
        super.onStart();
    }


    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.signInButton) {
            startLoginProcess();
        } else if (v.getId() == R.id.forgotPasswordButton) {
            handleForgotPassword();
        } else if (v.getId() == R.id.joinNowButton) {
            startActivity(new Intent(this, SignupActivity.class));
            overridePendingTransition(R.anim.slide_in_bottom, R.anim.slide_out_top);
        }
    }

    private void handleForgotPassword(){
        if(getResources().getBoolean(R.bool.has_forgot_password)){
            startActivity(new Intent(this, ForgotPasswordActivity.class));
            overridePendingTransition(Transition.ENTER.getAnimationStart(), Transition.ENTER.getAnimationEnd());
        }
        else{
            showForgotPasswordAlertDialog();
        }
    }

    private void showForgotPasswordAlertDialog(){
        final Dialog dialog = new Dialog(this);
        dialog.requestWindowFeature(Window.FEATURE_NO_TITLE);
        View alertView = LayoutInflater.from(this).inflate(R.layout.general_info_dialog,null);
        CustomTextView title = (CustomTextView) alertView.findViewById(R.id.dialogTitle);
        title.setText(getString(R.string.forgot_password_dialog_title));
        CustomTextView text = (CustomTextView) alertView.findViewById(R.id.dialogText);
        text.setLinksClickable(true);
        text.setMovementMethod(LinkMovementMethod.getInstance());
        text.setText(R.string.forgot_password_dialog_text);
        CustomButton okButton = (CustomButton)alertView.findViewById(R.id.okButton) ;
        okButton.setText(getString(R.string.got_it));
        okButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                dialog.dismiss();
            }
        });
        dialog.setContentView(alertView);
        final Window window = dialog.getWindow();
        window.setLayout(WindowManager.LayoutParams.WRAP_CONTENT, WindowManager.LayoutParams.WRAP_CONTENT);
        window.setBackgroundDrawableResource(android.R.color.transparent);
        window.setGravity(Gravity.CENTER);
        dialog.show();
    }

    private void startLoginProcess() {
        Utils.hideSoftKeyboard(passwordText);
        invalidEmailPasswordText.setVisibility(View.INVISIBLE);
        if (isValidLogin()) {
            signInButton.setEnabled(false);
            new LoginTask(this, this, getEmailAddress(),
                    passwordText.getText().toString(), companyCodeText.getText().toString(), "email").execute();
        } else {
            invalidEmailPasswordText.setVisibility(View.VISIBLE);
            invalidEmailPasswordText.setTextColor(getResources().getColor(R.color.error_message_color));
            invalidEmailPasswordText.setText(R.string.login_all_fields_required);
        }
    }

    /**
     *
     */
    private void shakeEmailPassword() {
        emailAddressText.startAnimation(shakeAnimation);
        passwordText.startAnimation(shakeAnimation);
    }

    private void shakeCompanyCode() {
        companyCodeText.startAnimation(shakeAnimation);
    }


    /**
     * @return
     */
    private boolean isValidLogin() {
        String emailAddr = getEmailAddress();
        String password = passwordText.getText().toString();
        if (StringUtil.isNotEmpty(emailAddr) && StringUtil.isNotEmpty(password)) {
            if (hasCompanyCode) {
                if (StringUtil.isEmpty(companyCodeText.getText().toString().trim())) {
                    return false;
                }
            }
            return true;
        }
        return false;
    }

    private String getEmailAddress(){
        String emailAddress = emailAddressText.getText().toString();
        String domain = getString(R.string.login_domain);
        if(!domain.equals("dummy") && !emailAddress.contains("@")){
            emailAddress = emailAddress + getString(R.string.login_domain);
        }
        return emailAddress;
    }

    TextWatcher textWatcherEmailAddress = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            boolean validTextLength = hasCompanyCode ?
                    (companyCodeText.getText().length() > 0 && passwordText.getText().length() > 0)
                    : (passwordText.getText().length() > 0);
            if (s.length() > 0 && validTextLength) {
                signInButton.setEnabled(true);
            } else {
                signInButton.setEnabled(false);
            }
        }

        @Override
        public void afterTextChanged(Editable s) {

        }
    };
    TextWatcher textWatcherCompanyCode = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            boolean validTextLength =
                    (passwordText.getText().length() > 0 && emailAddressText.getText().length() > 0);

            if (s.length() > 0 && validTextLength) {
                signInButton.setEnabled(true);
            } else {
                signInButton.setEnabled(false);
            }
        }

        @Override
        public void afterTextChanged(Editable s) {

        }
    };
    TextWatcher textWatcherPassword = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            boolean validTextLength = hasCompanyCode ?
                    (companyCodeText.getText().length() > 0 && emailAddressText.getText().length() > 0)
                    : (emailAddressText.getText().length() > 0);
            if (s.length() > 0 && validTextLength) {
                signInButton.setEnabled(true);
            } else {
                signInButton.setEnabled(false);
            }
        }

        @Override
        public void afterTextChanged(Editable s) {

        }
    };

    @Override
    public void onLoginError(Exception e) {
        e.printStackTrace();
        if (e instanceof InvalidEmailPasswordException) {
            shakeEmailPassword();
        } else if (e instanceof InvalidCompanyCodeException) {
            shakeCompanyCode();

        }
        signInProgress.setVisibility(View.GONE);
        signInButton.setEnabled(true);
        invalidEmailPasswordText.setText(Html.fromHtml((e.getMessage())));
        invalidEmailPasswordText.setTextColor(getResources().getColor(R.color.error_message_color));
        invalidEmailPasswordText.setVisibility(View.VISIBLE);
    }

    @Override
    public void onPreExecute() {
        signInProgress.setVisibility(View.VISIBLE);
    }

    @Override
    public void onLoginSuccess() {
        invalidEmailPasswordText.setVisibility(View.INVISIBLE);
        Intent intent = new Intent(LoginActivity.this, ReactHomeActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        intent.putExtra("FromLogin", true);
        startActivity(intent);
        overridePendingTransition(Transition.ENTER.getAnimationStart(), Transition.ENTER.getAnimationEnd());
        finish();
    }

    private void showPopupWindow() {
        AlertDialog alertDialog = new AlertDialog.Builder(this)
                .setCancelable(true)
                .setView(R.layout.login_company_code_info_popup)
                .setPositiveButton("OK", new DialogInterface.OnClickListener() {
                    @Override
                    public void onClick(DialogInterface dialog, int which) {

                    }
                }).create();

        alertDialog.show();
    }

    public static Intent getLoginActivityIntent(Context context, boolean showCompanyCode, String companyCode) {
        Intent loginActivityIntent = new Intent(context, LoginActivity.class);
        loginActivityIntent.putExtra("SHOW_COMPANY_CODE", showCompanyCode);
        loginActivityIntent.putExtra("COMPANY_CODE", companyCode);
        return loginActivityIntent;
    }


}
