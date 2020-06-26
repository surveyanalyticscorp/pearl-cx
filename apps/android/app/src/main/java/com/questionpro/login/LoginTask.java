package com.questionpro.login;

import android.app.Activity;

import com.questionpro.model.AppUser;
import com.questionpro.service.LoginService;
import com.questionpro.utils.StringUtil;
import com.questionpro.networktask.ErrorLoggedAsyncTask;

public  class LoginTask extends ErrorLoggedAsyncTask<Void, Void, Object> {
        public interface LoginListener{
            public void onLoginSuccess();
            public void onLoginError(Exception e);
            public void onPreExecute();
        }
        private String mEmail, mPswd, mCompanyCode, mSourceMode;
        private boolean useGlobalLogin;
        private Activity activity;
        private LoginListener loginListener;
        private boolean hasCompanyCode;
        public LoginTask(Activity activity,LoginListener loginListener,String email, String pswd, String comCode, String source) {
            this.activity = activity;
            this.loginListener = loginListener;
            this.mEmail = email;
            this.mPswd = pswd;
            this.mCompanyCode = comCode;
            this.mSourceMode = source;

            this.hasCompanyCode = StringUtil.isNotEmpty(comCode);

        }

        @Override
        protected void onPostExecute(Object o) {
            super.onPostExecute(o);

            if (o instanceof Throwable) {
                if(o instanceof Exception) {
                    loginListener.onLoginError((Exception) o);
                }
               else{
                    loginListener.onLoginError(new Exception());
                }

            } else {
                loginListener.onLoginSuccess();
            }

        }

        @Override
        protected Object doInBackgroundInternal(Object... arg) throws Exception {
            AppUser appUser = null;
            if (!hasCompanyCode) {
                appUser = new AppUser(mEmail, mPswd);
            } else {
                appUser = new AppUser(mEmail, mPswd, mCompanyCode, mSourceMode);
            }
            LoginService.doLogin(appUser, activity);
            return null;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            loginListener.onPreExecute();
        }
    }