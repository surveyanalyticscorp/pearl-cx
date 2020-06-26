package com.questionpro.login;

import android.app.Dialog;
import android.app.ProgressDialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.os.Bundle;
import android.text.Html;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.appcompat.app.AlertDialog;
import androidx.fragment.app.DialogFragment;

import com.questionpro.service.ForgotPasswordService;
import com.questionpro.uiutils.Transition;
import com.questionpro.utils.StringUtil;
import com.questionpro.utils.Utils;
import com.questionpro.views.CustomEditText;
import com.questionpro.views.CustomTextView;
import com.questionpro.whitelabelapps.R;
import com.questionpro.networktask.ErrorLoggedAsyncTask;

public class OTPDialogFragment extends DialogFragment {

    private CustomTextView invalidOTPText;
    private CustomEditText otpText;
    private String emailAddress="", companyCode="";

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        // Use the Builder class for convenient dialog construction
        Bundle bundle = getArguments();
        if(bundle.containsKey("emailAddress")){
            emailAddress = bundle.getString("emailAddress");
        }
        if(bundle.containsKey("companyCode")){
            companyCode = bundle.getString("companyCode");
        }
        LayoutInflater inflater = getActivity().getLayoutInflater();
        View otpView = inflater.inflate(R.layout.otp_dialog, null);
        otpText = (CustomEditText) otpView.findViewById(R.id.otp);
        otpText.setImeOptions(EditorInfo.IME_ACTION_DONE);
        otpText.setOnEditorActionListener(onEditorActionListener);
        invalidOTPText = (CustomTextView) otpView.findViewById(R.id.invalidOTPText);
        AlertDialog.Builder builder = new AlertDialog.Builder(getActivity());
        setCancelable(false);
        builder.setView(otpView)
                .setPositiveButton(R.string.done,null)
                .setNegativeButton(R.string.cancel, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int id) {
                        dismiss();
                    }
                });
        AlertDialog alertDialog = builder.create();
        alertDialog.setOnShowListener(new DialogInterface.OnShowListener() {
            @Override
            public void onShow(DialogInterface dialog) {
                Button button = ((AlertDialog) dialog).getButton(AlertDialog.BUTTON_POSITIVE);
                button.setOnClickListener(new View.OnClickListener() {

                    @Override
                    public void onClick(View view) {
                        startVerifyProcess();
                    }
                });
            }
        });
        // Create the AlertDialog object and return it
        return alertDialog;
    }
    EditText.OnEditorActionListener onEditorActionListener = new TextView.OnEditorActionListener() {
        @Override
        public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                startVerifyProcess();
                return true;
            }
            return false;
        }
    };
    private void startVerifyProcess() {
        Utils.hideSoftKeyboard(otpText);

        if (StringUtil.isEmpty(otpText.getText().toString())) {
            invalidOTPText.setVisibility(View.VISIBLE);
            invalidOTPText.setText("Please enter the One Time Password!");
        } else {
            new ConfirmOTPTask().execute();
        }
    }

    public class ConfirmOTPTask extends ErrorLoggedAsyncTask<Void, Void, Object> {
        private ProgressDialog progressDialog;
        @Override
        protected void onPostExecute(Object o) {
            super.onPostExecute(o);
            if(progressDialog!=null){
                progressDialog.dismiss();
            }
            if (o instanceof Exception) {
                ((Exception) o).printStackTrace();

                invalidOTPText.setText(Html.fromHtml(((Exception) o).getMessage()));
                invalidOTPText.setVisibility(View.VISIBLE);

            } else {

                goToUpdatePassword();
            }

        }

        @Override
        protected Object doInBackgroundInternal(Object... arg) throws Exception {
            String message = ForgotPasswordService.verifyOTP(emailAddress,companyCode,
                    Long.parseLong(otpText.getText().toString()), getActivity());

            return message;
        }

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
            progressDialog = new ProgressDialog(getActivity());
            progressDialog.setMessage("Verifying OTP");
            progressDialog.setCancelable(false);
            progressDialog.show();

        }
    }

    private void goToUpdatePassword() {
        Intent i = new Intent(getActivity(), UpdatePasswordActivity.class);
        i.putExtra("emailAddress", emailAddress);
        i.putExtra("companyCode", companyCode);
        startActivity(i);
        getActivity().overridePendingTransition(Transition.ENTER.getAnimationStart(), Transition.ENTER.getAnimationEnd());
        getActivity().finish();
    }
}
