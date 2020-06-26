package com.questionpro.login;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Intent;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.AsyncTask;
import android.os.Build;
import android.os.Bundle;
import android.os.Message;
import android.util.Log;
import android.webkit.CookieManager;
import android.webkit.CookieSyncManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;

import com.questionpro.whitelabelapps.R;

import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpGet;
import org.apache.http.impl.client.DefaultHttpClient;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Created by Dattatraya Kunde on 3/1/17.
 */

public class SignupWithSlackActivity extends Activity{

    private WebView mWebView;
    ProgressDialog progressDialog;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.signup_with_slack_activity);

        mWebView=(WebView)findViewById(R.id.signup_with_slack_webview);

        try {
            progressDialog = new ProgressDialog(this);
            progressDialog.show();
        }catch (Exception e){e.printStackTrace();}

        WebSettings webSettings = mWebView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setSaveFormData(false);

        webSettings.setUserAgentString("Mozilla/5.0 Google");
        webSettings.setAppCacheEnabled(false);
        mWebView.loadUrl("https://slack.com/oauth/authorize?scope=identity.basic,identity.email&client_id="+
                getString(R.string.slack_client_id));

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                try {
                    if (progressDialog != null && progressDialog.isShowing())
                        progressDialog.cancel();
                }catch (Exception e){e.printStackTrace();}
            }

            @Override
            public void onFormResubmission(WebView view, Message dontResend, Message resend) {
                super.onFormResubmission(view, dontResend, resend);

            }

            @Override
            public void onReceivedLoginRequest(WebView view, String realm, String account, String args) {

                super.onReceivedLoginRequest(view, realm, account, args);
            }

            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {

                super.onPageStarted(view, url, favicon);
                //Log.d("Datta","onPageStarted:"+url);
                if(url.contains("code=")) {
                    Uri uri = Uri.parse(url);
                    if(uri.getHost().contains(getString(R.string.slack_domain))) {
                        String code = uri.getQueryParameter("code");
                        new GetUserDetailsAsynch(code).execute();
                        clearCookies();

                    }
                }

            }

        });
    }

    private void clearCookies(){
        mWebView.stopLoading();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP_MR1) {
            CookieManager.getInstance().removeAllCookies(null);
            CookieManager.getInstance().flush();
        } else {
            CookieSyncManager cookieSyncMngr = CookieSyncManager.createInstance(this);
            cookieSyncMngr.startSync();
            CookieManager cookieManager = CookieManager.getInstance();
            cookieManager.removeAllCookie();
            cookieManager.removeSessionCookie();
            cookieSyncMngr.stopSync();
            cookieSyncMngr.sync();
        }
    }
    /**
     *
     */
    private class GetUserDetailsAsynch extends AsyncTask<String,String,String> {

        private String mCode;
        ProgressDialog mProgressDialog;
        public GetUserDetailsAsynch(String code){
            this.mCode=code;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            mProgressDialog=new ProgressDialog(SignupWithSlackActivity.this);
            mProgressDialog.show();
        }

        @Override
        protected String doInBackground(String... params) {
            String url="https://slack.com/api/oauth.access?client_id="+getString(R.string.slack_client_id)+
                    "&client_secret="+getString(R.string.slack_client_secret)+"&code="+mCode;
            //Log.d("Datta","Final url: "+url);
            String res=getResult(url);
            return res;
        }

        @Override
        protected void onPostExecute(String s) {
            super.onPostExecute(s);
            mProgressDialog.cancel();
            Intent intent=new Intent();
            intent.putExtra("Result",s);
            setResult(RESULT_OK,intent);
            SignupWithSlackActivity.this.finish();
        }
    }


    /**
     *
     * @param url
     * @return
     */
    public String getResult(String url)
    {
        //Log.d("Datta", "Url:"+url);
        InputStream inputStream = null;
        String result = "";
        try {

            HttpClient httpclient = new DefaultHttpClient();

            HttpResponse httpResponse = httpclient.execute(new HttpGet(url));

            inputStream = httpResponse.getEntity().getContent();

            if(inputStream != null)
                result = convertInputStreamToString(inputStream);
            else
                result = "Did not work!";

        } catch (Exception e) {
            Log.d("InputStream", e.getLocalizedMessage());
            e.printStackTrace();
        }

        return result;

    }

    // convert input stream to String
    private static String convertInputStreamToString(InputStream inputStream) throws IOException {
        BufferedReader bufferedReader = new BufferedReader( new InputStreamReader(inputStream));
        String line = "";
        String result = "";
        while((line = bufferedReader.readLine()) != null)
            result += line;

        inputStream.close();
        return result;

    }
}
