package com.example.flutter_survey_intercept
import android.content.Context
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.questionpro.cxlib.QuestionProCX
import com.questionpro.cxlib.enums.DataCenter
import com.questionpro.cxlib.interfaces.IQuestionProInitCallback
import com.questionpro.cxlib.interfaces.IQuestionProCallback
import com.questionpro.cxlib.model.TouchPoint
import io.flutter.embedding.engine.plugins.FlutterPlugin
import io.flutter.embedding.engine.plugins.activity.ActivityAware
import io.flutter.embedding.engine.plugins.activity.ActivityPluginBinding
import io.flutter.plugin.common.MethodCall
import io.flutter.plugin.common.MethodChannel

class FlutterSurveyIntercept : FlutterPlugin, MethodChannel.MethodCallHandler, ActivityAware {

    private lateinit var channel: MethodChannel
    private lateinit var cxChannel: MethodChannel
    private var applicationContext: Context? = null
    private var isInitialized = false
    private var hasRepliedToInit = false
    private val mainHandler = Handler(Looper.getMainLooper())

    companion object {
        private const val CHANNEL = "intercept_sdk"
        private const val CX_CHANNEL = "Cx_Callback"
        private const val TAG = "FlutterSurveyIntercept"
        private const val API_KEY_META_NAME = "cx_manifest_api_key"
    }

    override fun onAttachedToEngine(binding: FlutterPlugin.FlutterPluginBinding) {
        applicationContext = binding.applicationContext

        channel = MethodChannel(binding.binaryMessenger, CHANNEL)
        channel.setMethodCallHandler(this)

        cxChannel = MethodChannel(binding.binaryMessenger, CX_CHANNEL)
        cxChannel.setMethodCallHandler { call, result ->
            if (call.method == "setScreenVisited") {
                setScreenVisited(call.argument("screen_name_key"), result)
            } else {
                result.notImplemented()
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
            "initialize" -> initialize(call.argument("dataCenter") ?: "US", result)
            "setDataMappings" -> setDataMappings(call.argument("customVariables"), result)
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

    private fun initialize(dataCenterStr: String, result: MethodChannel.Result) {
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

            hasRepliedToInit = false

            QuestionProCX.getInstance().init(ctx, touchPoint, object : IQuestionProInitCallback {
                override fun onInitializationSuccess(message: String?) {
                    synchronized(this@FlutterSurveyIntercept) {
                        if (!hasRepliedToInit) {
                            hasRepliedToInit = true
                            isInitialized = true
                            result.success(message ?: "SDK initialized successfully")
                            getSurveyUrl()
                        }
                    }
                }

                override fun onInitializationFailure(error: String?) {
                    synchronized(this@FlutterSurveyIntercept) {
                        if (!hasRepliedToInit) {
                            hasRepliedToInit = true
                            result.error("INIT_FAILED", error ?: "Initialization failed", null)
                        }
                    }
                }
            })
        } catch (e: Exception) {
            Log.e(TAG, "Exception during SDK initialization", e)
            if (!hasRepliedToInit) {
                hasRepliedToInit = true
                result.error("INIT_EXCEPTION", e.message ?: "Unknown error occurred", null)
            }
        }
    }

    private fun setScreenVisited(screenName: String?, result: MethodChannel.Result) {
        if (screenName.isNullOrEmpty()) {
            result.error("INVALID_ARGS", "screen_name_key is required", null)
            return
        }

        try {
            QuestionProCX.getInstance().setScreenVisited(screenName)
            result.success("Event logged")
            getSurveyUrl()
        } catch (e: Exception) {
            result.error("SCREEN_VIEW_ERROR", e.message ?: "Unknown error occurred", null)
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
            getSurveyUrl()
        } catch (e: Exception) {
            result.error("DATA_MAPPING_ERROR", e.message, null)
        }
    }

    /**
     * Callback listener triggered automatically when SDK has a survey URL available
     */
    private fun getSurveyUrl() {
        try {
            QuestionProCX.getInstance().getSurveyUrl(object : IQuestionProCallback {
                override fun getSurveyUrl(surveyUrl: String?) {
                    surveyUrl?.takeIf { it.isNotEmpty() }?.let { url ->
                        mainHandler.post {
                            channel.invokeMethod("onSurveyUrlReceived", mapOf("surveyUrl" to url))
                        }
                    }
                }
            })
        } catch (e: Exception) {
            Log.e(TAG, "Error setting up survey URL callback", e)
        }
    }

    override fun onAttachedToActivity(binding: ActivityPluginBinding) {}
    override fun onDetachedFromActivity() {}
    override fun onDetachedFromActivityForConfigChanges() {}
    override fun onReattachedToActivityForConfigChanges(binding: ActivityPluginBinding) {}
}