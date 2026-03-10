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
            "initializeSurvey" -> initializeSurvey(result)
            "launchSurvey" -> {
                val surveyId = call.argument<String>("surveyId") ?: ""
                launchSurvey(surveyId, result)
            }
            else -> result.notImplemented()
        }
    }

    private fun initializeSurvey(result: MethodChannel.Result) {
        // SDK is already initialized in MyApplication.onCreate()
        // This method just confirms the connection is working
        Log.d(TAG, "initializeSurvey called - SDK initialized in Application")
        result.success("SDK initialized in Application")
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
