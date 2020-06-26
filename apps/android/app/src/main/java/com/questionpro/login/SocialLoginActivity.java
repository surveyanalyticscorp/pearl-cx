package com.questionpro.login;

import android.app.ProgressDialog;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.MenuItem;
import android.view.View;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.appcompat.app.ActionBar;
import androidx.appcompat.app.AppCompatActivity;

import com.questionpro.model.AppUser;
import com.questionpro.uiutils.Transition;
import com.questionpro.utils.NetworkUtil;
import com.questionpro.views.CustomTextView;
import com.google.android.gms.auth.api.Auth;
import com.google.android.gms.auth.api.signin.GoogleSignInAccount;
import com.google.android.gms.auth.api.signin.GoogleSignInOptions;
import com.google.android.gms.auth.api.signin.GoogleSignInResult;
import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.microsoft.aad.adal.AuthenticationCallback;
import com.microsoft.aad.adal.AuthenticationResult;
import com.questionpro.whitelabelapps.R;
import com.questionpro.app.CoreApplication;
import com.questionpro.home.ReactHomeActivity;
import com.questionpro.marketing.MarketingActivity;

import org.json.JSONObject;

/**
 * Created by sachinsable on 17/04/17.
 */

public class SocialLoginActivity extends AppCompatActivity implements View.OnClickListener,
        GoogleApiClient.OnConnectionFailedListener, LoginTask.LoginListener {
    private GoogleSignInOptions gso;
    private GoogleApiClient mGoogleApiClient;
    private int RC_GOOGLE_SIGN_IN = 10;
    private int RC_SLACK_SIGN_IN = 20;
    private final String TAG = "SocialLoginActivity";
    private LinearLayout loginWithSlack, loginWithGoogle, loginWithOffice365;
    private CustomTextView loginWithCompanyCode;
    private AuthenticationManager mAuthContext;
    private ProgressDialog progressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.social_login_activity);

        ActionBar actionBar = getSupportActionBar();
        actionBar.setDisplayHomeAsUpEnabled(true);

        loginWithSlack = (LinearLayout) findViewById(R.id.loginWithSlack);
        loginWithGoogle = (LinearLayout) findViewById(R.id.loginWithGoogle);
        loginWithOffice365 = (LinearLayout) findViewById(R.id.loginWithOffice365);
        loginWithCompanyCode = (CustomTextView) findViewById(R.id.loginWithCompanyCode);
        gso = new GoogleSignInOptions.Builder(GoogleSignInOptions.DEFAULT_SIGN_IN)
                .requestEmail()
                .build();

        mGoogleApiClient = new GoogleApiClient.Builder(this)
                .enableAutoManage(this, this)
                .addApi(Auth.GOOGLE_SIGN_IN_API, gso)
                .build();


        setTitle("");
        AuthenticationManager.getInstance().setContextActivity(this);


        loginWithSlack.setOnClickListener(this);
        loginWithGoogle.setOnClickListener(this);
        loginWithOffice365.setOnClickListener(this);
        loginWithCompanyCode.setOnClickListener(this);
    }

    @Override
    public void onClick(View v) {
        if (v.getId() == R.id.loginWithGoogle) {
            if (NetworkUtil.getConnectivityStatus(SocialLoginActivity.this) == NetworkUtil.TYPE_NOT_CONNECTED) {
                showErrorToast(getString(R.string.no_internet_message));
            } else {
                Intent signInIntent = Auth.GoogleSignInApi.getSignInIntent(mGoogleApiClient);
                startActivityForResult(signInIntent, RC_GOOGLE_SIGN_IN);
            }
        } else if (v.getId() == R.id.loginWithSlack) {
            if (NetworkUtil.getConnectivityStatus(SocialLoginActivity.this) == NetworkUtil.TYPE_NOT_CONNECTED) {
                showErrorToast(getString(R.string.no_internet_message));
            } else {
                Intent intent = new Intent(SocialLoginActivity.this, SignupWithSlackActivity.class);
                startActivityForResult(intent, RC_SLACK_SIGN_IN);
            }
        } else if (v.getId() == R.id.loginWithOffice365) {
            if (NetworkUtil.getConnectivityStatus(SocialLoginActivity.this) == NetworkUtil.TYPE_NOT_CONNECTED) {
                showErrorToast(getString(R.string.no_internet_message));
            } else {
                connectToOffice365();
            }
        } else if (v.getId() == R.id.loginWithCompanyCode) {
            if (NetworkUtil.getConnectivityStatus(SocialLoginActivity.this) == NetworkUtil.TYPE_NOT_CONNECTED) {
                showErrorToast(getString(R.string.no_internet_message));
            } else {
                startActivity(new Intent(SocialLoginActivity.this, LoginActivity.class));
                overridePendingTransition(Transition.ENTER.getAnimationStart(), Transition.ENTER.getAnimationEnd());
            }
        }

    }

    @Override
    public void onBackPressed() {
        finish();
        if (getIntent().getBooleanExtra("LoggedOut", false)) {
            startActivity(new Intent(this, MarketingActivity.class));
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

    private void connectToOffice365() {
        mAuthContext = AuthenticationManager.getInstance();
        mAuthContext.setContextActivity(this);
        mAuthContext.getAuthenticationContext().getCache().removeAll();

        mAuthContext.connect(
                new AuthenticationCallback<AuthenticationResult>() {
                    /**
                     * If the connection is successful, the activity extracts the username and
                     * displayableId values from the authentication result object and sends them
                     * to the SendMail activity.
                     * @param result The authentication result object that contains information about
                     *               the user and the tokens.
                     */
                    @Override
                    public void onSuccess(AuthenticationResult result) {
                        Log.i(TAG, "onConnectButtonClick - Successfully connected to Office 365");
                        Log.i(TAG, "Result - " + result.getTenantId());
                        Log.i(TAG, "Result - " + result.getUserInfo().getDisplayableId() + ": " + result.getUserInfo().getUserId());
                        new LoginTask(SocialLoginActivity.this, SocialLoginActivity.this, result.getUserInfo().getDisplayableId(), "", result.getTenantId(), "microsoft").execute();
                    }

                    @Override
                    public void onError(final Exception e) {
                        Log.e(TAG, "onError - " + e.getMessage());

                    }
                });
    }

    private void showErrorToast(String message) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show();
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (null != mAuthContext) {
            mAuthContext
                    .getAuthenticationContext()
                    .onActivityResult(requestCode, resultCode, data);
        }
        if (requestCode == RC_GOOGLE_SIGN_IN) {
            GoogleSignInResult result = Auth.GoogleSignInApi.getSignInResultFromIntent(data);
            handleSignInResult(result);
        } else if (requestCode == RC_SLACK_SIGN_IN) {
            if (resultCode == RESULT_OK) {
                Log.d("Datta", "Slack sing up result:" + data.getStringExtra("Result"));
                //{"ok":true,"access_token":"xoxp-3409868097-4170679879-147414652290-2af3724b5effc297e5634378d78f19f6","scope":"identity.basic,identity.email","user":{"name":"Datta Kunde","id":"U0450KZRV","email":"datta.kunde@surveyanalytics.com"},"team":{"id":"T03C1RJ2V"}}
                try {
                    JSONObject jsonObject = new JSONObject(data.getStringExtra("Result"));
                    String email = jsonObject.getJSONObject("user").getString("email");
                    String temId = jsonObject.getJSONObject("team").getString("id");
                    new LoginTask(SocialLoginActivity.this, SocialLoginActivity.this, email, "", temId, "slack").execute();
                } catch (Exception e) {
                }
            }
        }
    }


    /**
     * @param result
     */
    private void handleSignInResult(GoogleSignInResult result) {
        Log.d("Datta", "handleSignInResult:" + result.isSuccess());
        //Toast.makeText(LoginActivity.this,"Result: "+result.isSuccess(),Toast.LENGTH_LONG).show();
        if (result.isSuccess()) {
            // Signed in successfully, show authenticated UI.
            GoogleSignInAccount acct = result.getSignInAccount();
            String email = acct.getEmail();
            int index = email.indexOf('@');
            String domain = email.substring((index + 1), email.length());
            new LoginTask(SocialLoginActivity.this, SocialLoginActivity.this, email, "", domain, "google").execute();
        } else {
            showErrorToast("Failed to login with Google. Please try again.");
        }
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {

    }

    @Override
    public void onLoginSuccess() {
        if (progressDialog != null) {
            progressDialog.dismiss();
        }
        Intent intent = new Intent(SocialLoginActivity.this, ReactHomeActivity.class);
        intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        updateUserForSocialLogin();
        startActivity(intent);
        overridePendingTransition(Transition.ENTER.getAnimationStart(), Transition.ENTER.getAnimationEnd());

        finish();
    }

    private void updateUserForSocialLogin() {
        AppUser appUser = AppUser.loadFromContext(CoreApplication.getContext());
        appUser.socialLoggedIn = true;
        AppUser.saveForContext(appUser, CoreApplication.getContext());
    }

    @Override
    public void onLoginError(Exception e) {
        if (progressDialog != null) {
            progressDialog.dismiss();
        }
        showErrorToast(e.getMessage());
    }

    @Override
    public void onPreExecute() {
        progressDialog = new ProgressDialog(this);
        progressDialog.setTitle("Login");
        progressDialog.setMessage("Logging in...");
        progressDialog.setCancelable(false);
        progressDialog.show();
    }
}
