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
    private lateinit var cxChannel: MethodChannel
    private var applicationContext: Context? = null
    private var activity: Activity? = null
    private var isInitialized = false

    companion object {
        private const val CHANNEL = "math_flutter"
        private const val CX_CHANNEL = "Cx_Callback"
        private const val TAG = "MathFlutterPlugin"
        private const val API_KEY_META_NAME = "cx_manifest_api_key"
    }

    override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        applicationContext = binding.applicationContext
        
        channel = MethodChannel(binding.binaryMessenger, CHANNEL)
        channel.setMethodCallHandler(this)
        
        cxChannel = MethodChannel(binding.binaryMessenger, CX_CHANNEL)
        cxChannel.setMethodCallHandler { call, result ->
            when (call.method) {
                "nativeMethod" -> handleScreenView(
                    call.argument<String>("screen_name_key"),
                    result
                )
                else -> result.notImplemented()
            }
        }
    }

    override fun onDetachedFromEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        channel.setMethodCallHandler(null)
        cxChannel.setMethodCallHandler(null)
        applicationContext = null
    }

    override fun onMethodCall(call: MethodCall, result: MethodChannel.Result) {
        when (call.method) {
            "initializeSurvey" -> initializeSurvey(
                call.argument<String>("dataCenter") ?: "US",
                result
            )
            "launchSurvey" -> launchSurvey(
                call.argument<String>("surveyId") ?: "",
                result
            )
            "setDataMappings" -> setDataMappings(
                call.argument<Map<String, String>>("customVariables"),
                result
            )
            else -> result.notImplemented()
        }
    }

    private fun getApiKeyFromManifest(context: Context): String? {
        return try {
            val appInfo = context.packageManager.getApplicationInfo(
                context.packageName,
                android.content.pm.PackageManager.GET_META_DATA
            )
            appInfo.metaData?.getString(API_KEY_META_NAME)
        } catch (e: Exception) {
            Log.e(TAG, "Error reading API key from manifest", e)
            null
        }
    }

    private fun parseDataCenter(dataCenterStr: String): DataCenter {
        return try {
            DataCenter.valueOf(dataCenterStr.uppercase())
        } catch (e: IllegalArgumentException) {
            DataCenter.US
        }
    }

    private fun initializeSurvey(dataCenterStr: String, result: MethodChannel.Result) {
        val ctx = applicationContext ?: run {
            result.error("NO_CONTEXT", "Application context not available", null)
            return
        }

        if (isInitialized) {
            result.success("SDK already initialized")
            return
        }

        val apiKey = getApiKeyFromManifest(ctx)
        if (apiKey.isNullOrEmpty()) {
            result.error("MISSING_API_KEY", "API key not found in AndroidManifest.xml", null)
            return
        }

        try {
            val dataCenter = parseDataCenter(dataCenterStr)
            val touchPoint = TouchPoint.Builder(dataCenter).build()

            QuestionProCX.getInstance().init(ctx, touchPoint, object : IQuestionProInitCallback {
                override fun onInitializationSuccess(message: String?) {
                    isInitialized = true
                    result.success("SDK initialized successfully")
                }

                override fun onInitializationFailure(error: String?) {
                    result.error("INIT_FAILED", error ?: "Initialization failed", null)
                }
            })
        } catch (e: Exception) {
            result.error("INIT_EXCEPTION", e.message, null)
        }
    }

    private fun launchSurvey(surveyId: String, result: MethodChannel.Result) {
        val act = activity ?: run {
            result.error("NO_ACTIVITY", "Activity not attached", null)
            return
        }

        val id = surveyId.toLongOrNull() ?: 0L
        if (id <= 0) {
            result.error("INVALID_ARGS", "surveyId must be a positive number", null)
            return
        }

        try {
            val intent = Intent(act, InteractionActivity::class.java).apply {
                putExtra("SURVEY_ID", id)
                addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            }
            act.startActivity(intent)
            result.success("Survey launched")
        } catch (e: Exception) {
            result.error("LAUNCH_FAILED", e.message, null)
        }
    }

    private fun handleScreenView(screenName: String?, result: MethodChannel.Result) {
        val ctx = applicationContext ?: run {
            result.error("NO_CONTEXT", "Application context not available", null)
            return
        }

        if (screenName.isNullOrEmpty()) {
            result.error("INVALID_ARGS", "screen_name_key is required", null)
            return
        }

        val apiKey = getApiKeyFromManifest(ctx)
        if (apiKey.isNullOrEmpty()) {
            result.error("MISSING_API_KEY", "API key not found in AndroidManifest.xml", null)
            return
        }

        try {
            QuestionProCX.getInstance().setScreenVisited(screenName)
            result.success("Event logged")
        } catch (e: Exception) {
            result.error("SCREEN_VIEW_ERROR", e.message, null)
        }
    }

    private fun setDataMappings(customVariables: Map<String, String>?, result: MethodChannel.Result) {
        if (customVariables == null || customVariables.isEmpty()) {
            result.error("INVALID_ARGS", "customVariables cannot be null or empty", null)
            return
        }

        try {
            val customVars = HashMap<String, String>(customVariables)
            QuestionProCX.getInstance().setDataMappings(customVars)
            result.success("Data mappings set successfully")
        } catch (e: Exception) {
            result.error("DATA_MAPPING_ERROR", e.message, null)
        }
    }

    override fun onAttachedToActivity(binding: ActivityPluginBinding) {
        activity = binding.activity
    }

    override fun onDetachedFromActivity() {
        activity = null
    }

    override fun onDetachedFromActivityForConfigChanges() {
        activity = null
    }

    override fun onReattachedToActivityForConfigChanges(binding: ActivityPluginBinding) {
        activity = binding.activity
    }
}
