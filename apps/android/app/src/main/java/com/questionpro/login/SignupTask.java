package com.questionpro.login;

import android.app.Activity;

import com.questionpro.model.AppUser;
import com.questionpro.service.SignupService;
import com.questionpro.utils.StringUtil;
import com.questionpro.networktask.ErrorLoggedAsyncTask;

/**
 * Created by sachinsable on 10/3/17.
 */

public class SignupTask extends ErrorLoggedAsyncTask<Void, Void, Object> {

    public interface SignupListener{
        public void onSignupSuccess(String status);
        public void onSignupError(Exception e);
        public void onPreExecute();
    }
    private String mEmail, mPswd, mCompanyCode, firstName, lastName;
    private boolean useGlobalLogin;
    private Activity activity;
    private SignupListener signupListener;
    private boolean hasCompanyCode;
    public SignupTask(Activity activity, SignupListener signupListener,String firstName, String lastName, String email, String pswd, String comCode) {
        this.activity = activity;
        this.signupListener = signupListener;
        this.firstName = firstName;
        this.lastName = lastName;
        this.mEmail = email;
        this.mPswd = pswd;
        this.mCompanyCode = comCode;
        this.hasCompanyCode = StringUtil.isNotEmpty(comCode);

    }

    @Override
    protected void onPostExecute(Object o) {
        super.onPostExecute(o);

        if (o instanceof Exception) {
            signupListener.onSignupError((Exception) o);

        } else {
            signupListener.onSignupSuccess((String)o);
        }

    }

    @Override
    protected Object doInBackgroundInternal(Object... arg) throws Exception {
        AppUser appUser = null;
        if (!hasCompanyCode) {
            appUser = new AppUser(firstName,lastName,mEmail, mPswd, true);
        } else {
            appUser = new AppUser(firstName, lastName, mEmail, mPswd, mCompanyCode);
        }
        return SignupService.doSignup(appUser, activity);
    }

    @Override
    protected void onPreExecute() {
        super.onPreExecute();
        signupListener.onPreExecute();
    }

}
