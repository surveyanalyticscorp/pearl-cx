package com.questionpro.interceptsdk

import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import android.util.Log

import com.questionpro.cxlib.QuestionProCX;
import com.questionpro.cxlib.enums.DataCenter;
import com.questionpro.cxlib.enums.Platform;
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

        // Extract API key
        val apiKey = options.getString("apiKey")
        if (apiKey.isNullOrEmpty()) {
            promise.reject("INVALID_API_KEY", "API key is required")
            return
        }

        // Extract DataCenter (default to US)
        val dataCenterString = options.getString("dataCenter") ?: "US"
        
        // Extract debug setting from options (default to false)
        val enableDebug = options.getBoolean("enableDebug")
        
       // Map string to DataCenter enum
        val dataCenter = when (dataCenterString.uppercase()) {
            "US" -> DataCenter.US
            "EU" -> DataCenter.EU
            "CA" -> DataCenter.CA
            "SG" -> DataCenter.SG
            "AU" -> DataCenter.AU
            "AE" -> DataCenter.AE
            "SA" -> DataCenter.SA
            "KSA" -> DataCenter.KSA
            
            else -> {
                Log.w("InterceptSdk", "Unknown DataCenter: $dataCenterString, defaulting to US")
                DataCenter.US
            }
        }
        
        if (enableDebug) {
            Log.d("InterceptSdk", "Using DataCenter: $dataCenter")
        }
            
            val touchPoint = TouchPoint.Builder(dataCenter)
                .setPlatform(Platform.REACT_NATIVE)
                .build()

            QuestionProCX.getInstance().init(reactContext, touchPoint, object : IQuestionProInitCallback {
                override fun onInitializationSuccess(s: String) {
                    if (enableDebug) {
                        Log.d("InterceptSdk","SDK initialization success: $s")
                    }
                    
                    // Resolve promise on successful initialization
                    val result = Arguments.createMap().apply {
                        putBoolean("success", true)
                        putString("message", "SDK configured successfully in Native Android")
                        putString("response", s)
                    }
                    promise.resolve(result)
                }

                override fun onInitializationFailure(s: String) {
                    if (enableDebug) {
                        Log.d("InterceptSdk","SDK initialization failure: $s")
                    }
                    
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
    fun setScreenVisited(screenName: String, promise: Promise) {
        try {
            Log.d("InterceptSdk", "Set Screen name in Android: $screenName")
            QuestionProCX.getInstance().setScreenVisited(screenName);
            promise.resolve("setScreenVisited success")
        }catch (e: Exception) {
            Log.e("InterceptSdk", "Is survey available failed", e)
            promise.reject("SET_SCREEN_NAME_ERROR: ", e.message, e)
        }
    }

     @ReactMethod
    fun setDataMappings(dataMappings: ReadableMap, promise: Promise) {
        Log.d("InterceptSdk", "setDataMappings called")
        
        try {
            // Convert ReadableMap to HashMap
            val mappingsMap = HashMap<String, String>()
            val iterator: ReadableMapKeySetIterator = dataMappings.keySetIterator()
            
            while (iterator.hasNextKey()) {
                val key = iterator.nextKey()
                val value = dataMappings.getString(key)
                if (value != null) {
                    mappingsMap[key] = value
                }
            }
            
            Log.d("InterceptSdk", "Data mappings converted: $mappingsMap")
            
            // Call QuestionPro Android CX SDK
            QuestionProCX.getInstance().setDataMappings(mappingsMap)
            
            val result = Arguments.createMap().apply {
                putBoolean("success", true)
                putString("message", "Data mappings set successfully")
                putInt("mappingsCount", mappingsMap.size)
                putDouble("timestamp", System.currentTimeMillis().toDouble())
            }
            
            promise.resolve(result)
            
        } catch (e: Exception) {
            Log.e("InterceptSdk", "setDataMappings error", e)
            promise.reject("SET_DATA_MAPPINGS_ERROR", e.message, e)
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
                putString("message", "Event notified successfully123")
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
