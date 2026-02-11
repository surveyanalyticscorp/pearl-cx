package com.example.math_flutter

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.util.Log
import com.questionpro.cxlib.QuestionProCX
import com.questionpro.cxlib.enums.DataCenter
import com.questionpro.cxlib.interfaces.IQuestionProInitCallback
import com.questionpro.cxlib.model.TouchPoint
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.embedding.engine.plugins.activity.ActivityAware
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel
import com.questionpro.cxlib.InteractionActivity

class MathFlutterPlugin :
    FlutterPlugin,
    MethodChannel.MethodCallHandler,
    ActivityAware {

    private lateinit var channel: MethodChannel
    private var applicationContext: Context? = null
    private var activity: Activity? = null
    private var isInitialized = false

    companion object {
        private const val CHANNEL = "math_flutter"
        private const val TAG = "MathFlutterPlugin"
    }

    override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        applicationContext = binding.applicationContext
        channel = MethodChannel(binding.binaryMessenger, CHANNEL)
        channel.setMethodCallHandler(this)
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "initializeSurvey" -> {
                val dataCenter = call.argument<String>("dataCenter") ?: "US"
                initializeSurvey(dataCenter, result)
            }
            "launchSurvey" -> {
                val surveyId = call.argument<String>("surveyId") ?: ""
                launchSurvey(surveyId, result)
            }
            else -> result.notImplemented()
        }
    }

    private fun initializeSurvey(dataCenterStr: String, result: MethodChannel.Result) {
        val ctx = applicationContext
        if (ctx == null) {
            result.error("NO_CONTEXT", "Application context not available", null)
            return
        }

        if (isInitialized) {
            result.success("SDK already initialized")
            return
        }

        try {
            // Read API key from AndroidManifest.xml metadata
            val appInfo = ctx.packageManager.getApplicationInfo(
                ctx.packageName,
                android.content.pm.PackageManager.GET_META_DATA
            )
            val apiKey = appInfo.metaData?.getString("cx_manifest_api_key")

            if (apiKey.isNullOrEmpty()) {
                result.error(
                    "MISSING_API_KEY",
                    "API key not found in AndroidManifest.xml. Add <meta-data android:name=\"cx_manifest_api_key\" android:value=\"YOUR_API_KEY\" /> to your AndroidManifest.xml",
                    null
                )
                return
            }

            val dataCenter = when (dataCenterStr.uppercase()) {
                "EU" -> DataCenter.EU
                else -> DataCenter.US
            }

            val touchPoint = TouchPoint.Builder(dataCenter).build()

            QuestionProCX.getInstance().init(ctx, touchPoint, object : IQuestionProInitCallback {
                override fun onInitializationSuccess(message: String?) {
                    Log.d(TAG, "QuestionPro CX SDK initialized successfully: $message")
                    isInitialized = true
                    result.success("SDK initialized successfully")
                }

                override fun onInitializationFailure(error: String?) {
                    Log.e(TAG, "QuestionPro CX SDK initialization failed: $error")
                    result.error("INIT_FAILED", error ?: "Initialization failed", null)
                }
            })
            
        } catch (e: Exception) {
            Log.e(TAG, "initializeSurvey error", e)
            result.error("INIT_EXCEPTION", e.message, null)
        }
    }

    private fun launchSurvey(surveyId: String, result: MethodChannel.Result) {
        val act = activity
        if (act == null) {
            result.error("NO_ACTIVITY", "Activity not attached", null)
            return
        }
        try {
            val id = surveyId.toLongOrNull() ?: 0L
            if (id <= 0) {
                result.error("INVALID_ARGS", "surveyId is required (positive number)", null)
                return
            }
            val intent = Intent(act, InteractionActivity::class.java).apply {
                putExtra("SURVEY_ID", id)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            act.startActivity(intent)
            result.success("Survey launched")
        } catch (e: Exception) {
            Log.e(TAG, "launchSurvey error", e)
            result.error("LAUNCH_FAILED", e.message, null)
        }
    }

    override fun onAttachedToActivity(binding: ActivityPluginBinding) {
        activity = binding.activity
    }

    override fun onDetachedFromActivity() {
        activity = null
    }

    override fun onDetachedFromActivityForConfigChanges() {}
    override fun onReattachedToActivityForConfigChanges(binding: ActivityPluginBinding) {}

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel.setMethodCallHandler(null)
        applicationContext = null
    }
}
