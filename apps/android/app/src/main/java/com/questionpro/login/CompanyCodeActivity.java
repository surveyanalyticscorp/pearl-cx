package com.questionpro.login;

import android.content.Context;
import android.content.Intent;
import android.os.Bundle;
import android.text.Editable;
import android.text.TextUtils;
import android.text.TextWatcher;
import android.view.KeyEvent;
import android.view.View;
import android.view.inputmethod.EditorInfo;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.appcompat.app.AppCompatActivity;

import com.questionpro.views.CustomButton;
import com.questionpro.views.CustomEditText;
import com.questionpro.whitelabelapps.R;

public class CompanyCodeActivity extends AppCompatActivity {

    private CustomEditText editTextCompanyCode;
    private CustomButton buttonCodeNext;
    private String companyCode;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_office_code);
        editTextCompanyCode = (CustomEditText) findViewById(R.id.editTextCompanyCode);
        buttonCodeNext = (CustomButton) findViewById(R.id.buttonCodeNext);
        editTextCompanyCode.setImeOptions(EditorInfo.IME_ACTION_DONE);
        editTextCompanyCode.setOnEditorActionListener(onEditorActionListener);
        editTextCompanyCode.addTextChangedListener(textWatcherCompanyCode);
        buttonCodeNext.setEnabled(editTextCompanyCode.getText().toString().length()>0);
        //editTextCompanyCode.setText("vistaprintmobile");
        buttonCodeNext.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                companyCode = editTextCompanyCode.getText().toString().trim();
                checkCompanyCodeAndGoToLogin();
            }
        });
    }
    private void checkCompanyCodeAndGoToLogin(){
        if (TextUtils.isEmpty(companyCode)) {
            showToastMessage("Invalid Code");
        }else{
            startActivity(LoginActivity.getLoginActivityIntent(CompanyCodeActivity.this, false, editTextCompanyCode.getText().toString().trim()));
        }

    }
    private void showToastMessage(String toastMessage) {
        Toast.makeText(CompanyCodeActivity.this, toastMessage, Toast.LENGTH_SHORT).show();
    }
    TextWatcher textWatcherCompanyCode = new TextWatcher() {
        @Override
        public void beforeTextChanged(CharSequence s, int start, int count, int after) {

        }

        @Override
        public void onTextChanged(CharSequence s, int start, int before, int count) {
            companyCode = s.toString();
            buttonCodeNext.setEnabled(s.length() > 1);
        }

        @Override
        public void afterTextChanged(Editable s) {

        }
    };
    EditText.OnEditorActionListener onEditorActionListener = new TextView.OnEditorActionListener() {
        @Override
        public boolean onEditorAction(TextView v, int actionId, KeyEvent event) {
            if (actionId == EditorInfo.IME_ACTION_DONE) {
                checkCompanyCodeAndGoToLogin();
                return true;
            }
            return false;
        }
    };

    public static Intent getLaunchActivityIntent(Context context) {
        Intent officeCodeIntent = new Intent(context, CompanyCodeActivity.class);
        return officeCodeIntent;
    }

}
