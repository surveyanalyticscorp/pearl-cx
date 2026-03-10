package com.example.math_flutter

import android.app.Application
import android.util.Log
import com.questionpro.cxlib.QuestionProCX
import com.questionpro.cxlib.enums.DataCenter
import com.questionpro.cxlib.interfaces.IQuestionProInitCallback
import com.questionpro.cxlib.model.TouchPoint

/**
 * Custom Application class that initializes the QuestionPro CX SDK
 * immediately when the app starts.
 */
class MyApplication : Application() {

    companion object {
        private const val TAG = "MyApplication"
    }

    override fun onCreate() {
        super.onCreate()
        
        // SDK initializes immediately when app starts
        val touchPoint = TouchPoint.Builder(DataCenter.US).build()
        
        QuestionProCX.getInstance().init(this, touchPoint, object : IQuestionProInitCallback {
            override fun onInitializationSuccess(message: String?) {
                Log.d(TAG, "QuestionPro CX SDK initialized successfully: $message")
            }

            override fun onInitializationFailure(error: String?) {
                Log.e(TAG, "QuestionPro CX SDK initialization failed: $error")
            }
        })
    }
}
