package com.questionpro.interceptsdk

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.util.Log

import com.questionpro.cxlib.QuestionProCX;
import com.questionpro.cxlib.enums.DataCenter;
import com.questionpro.cxlib.interfaces.IQuestionProInitCallback;
import com.questionpro.cxlib.model.TouchPoint;


class InterceptSdkModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "InterceptSdk"
    }

    @ReactMethod
    fun configure(options: ReadableMap, promise: Promise) {
        try {
            Log.d("InterceptSdk", "Datta Configure called with: $options")
            
            val touchPoint = TouchPoint.Builder(DataCenter.US)
                .build()

            QuestionProCX.getInstance().init(reactContext, touchPoint, object : IQuestionProInitCallback {
                override fun onInitializationSuccess(s: String) {
                    Log.d("Datta","DDDDD onInitializationSuccess: $s")
                    
                    // Resolve promise on successful initialization
                    val result = Arguments.createMap().apply {
                        putBoolean("success", true)
                        putString("message", "SDK configured successfully in Native Android")
                        putString("response", s)
                    }
                    promise.resolve(result)
                }

                override fun onInitializationFailure(s: String) {
                    Log.d("Datta","DDDD onInitializationFailure: $s")
                    
                    // Reject promise on initialization failure
                    promise.reject("INITIALIZATION_FAILED", "SDK initialization failed: $s")
                }
            })
            
        } catch (e: Exception) {
            Log.e("InterceptSdk", "Configure failed", e)
            promise.reject("CONFIGURE_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun startSurvey(surveyId: String, promise: Promise) {
        try {
            Log.d("InterceptSdk", "Start survey called with: $surveyId")
            
            // TODO: Call your existing native SDK startSurvey method
            // Example: yourNativeSdk.startSurvey(surveyId)
            
            val result = Arguments.createMap().apply {
                putBoolean("success", true)
                putString("surveyId", surveyId)
                putString("message", "Survey started successfully")
            }
            promise.resolve(result)
        } catch (e: Exception) {
            Log.e("InterceptSdk", "Start survey failed", e)
            promise.reject("START_SURVEY_ERROR", e.message, e)
        }
    }

    @ReactMethod
    fun notifyEvent(eventType: String, promise: Promise) {
        try {
            Log.d("InterceptSdk", "Notify event called with: $eventType")
            
            // TODO: Call your existing native SDK notifyEvent method
            // Example: yourNativeSdk.notifyEvent(eventType)
            
            val result = Arguments.createMap().apply {
                putBoolean("success", true)
                putString("eventId", "native_${System.currentTimeMillis()}")
                putString("message", "Event notified successfully")
            }
            promise.resolve(result)
        } catch (e: Exception) {
            Log.e("InterceptSdk", "Notify event failed", e)
            promise.reject("NOTIFY_EVENT_ERROR", e.message, e)
        }
    }

    private fun sendEvent(eventName: String, params: WritableMap?) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }

    // Helper method to emit survey events
    private fun emitSurveyEvent(eventType: String, data: WritableMap? = null) {
        val eventData = Arguments.createMap().apply {
            putString("type", eventType)
            if (data != null) {
                putMap("data", data)
            }
        }
        sendEvent("InterceptSdkEvent", eventData)
    }
}
