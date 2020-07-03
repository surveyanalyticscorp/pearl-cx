package com.questionpro.home;

import android.annotation.TargetApi;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.content.res.TypedArray;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.provider.Settings;
import android.text.TextUtils;
import android.util.Log;
import android.view.Display;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.Menu;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.Button;
import android.widget.CheckedTextView;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.PopupWindow;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import com.questionpro.whitelabelapps.BuildConfig;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AlertDialog;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.ListPopupWindow;
import androidx.appcompat.widget.Toolbar;
import androidx.core.app.ActivityCompat;
import androidx.core.view.GravityCompat;
import androidx.core.view.ViewCompat;
import androidx.drawerlayout.widget.DrawerLayout;

import com.alibaba.fastjson.JSON;
import com.questionpro.login.CompanyCodeActivity;
import com.questionpro.login.SocialLoginActivity;
import com.questionpro.model.AppUser;
import com.questionpro.model.MenuActive;
import com.questionpro.model.MenuLinks;
import com.questionpro.model.MenuType;
import com.questionpro.model.WebPage;
import com.questionpro.uiutils.Transition;
import com.questionpro.utils.PermissionUtils;
import com.questionpro.utils.StringUtil;
import com.questionpro.utils.Utils;
import com.questionpro.views.CheckableLinearLayout;
import com.questionpro.views.CustomTextView;
import com.questionpro.views.QPUIContext;
import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactRootView;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.common.LifecycleState;
import com.facebook.react.modules.core.DefaultHardwareBackBtnHandler;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.modules.core.PermissionAwareActivity;
import com.facebook.react.modules.core.PermissionListener;
import com.facebook.react.shell.MainReactPackage;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;
import com.github.wuxudong.rncharts.MPAndroidChartPackage;
import com.google.android.material.navigation.NavigationView;


import com.questionpro.whitelabelapps.R;
import com.questionpro.app.CoreApplication;
import com.questionpro.login.LoginActivity;
import com.questionpro.pushnotification.QPGcmToken;
import com.questionpro.reactnative.ReactAppCallbackModules;
import com.questionpro.uiutils.CircleTransform;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.rnfs.RNFSPackage;
import com.squareup.picasso.Picasso;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import com.swmansion.reanimated.ReanimatedPackage;
import com.wix.reactnativenotifications.RNNotificationsPackage;
import com.zyu.ReactNativeWheelPickerPackage;

import net.zubricky.AndroidKeyboardAdjust.AndroidKeyboardAdjustPackage;


import org.json.JSONArray;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;



import static android.os.Build.VERSION.SDK_INT;
import static com.wix.reactnativenotifications.Defs.TOKEN_RECEIVED_EVENT_NAME;

/**
 * Created by sachinsable on 13/09/16.
 */

public class ReactHomeActivity extends AppCompatActivity
        implements DefaultHardwareBackBtnHandler, ReactInstanceManager.ReactInstanceEventListener,
        PermissionAwareActivity, ActivityCompat.OnRequestPermissionsResultCallback, View.OnClickListener {
    private static final int OVERLAY_PERMISSION_REQ_CODE = 1234;
    private PermissionListener listener;
    private NavigationView navigationView;
    private final int ORIGINAL_MENU = 1001;
    private final int USER_DETAILS_MENU = 1002;
    private ArrayList<MenuLinks> contextMenus = new ArrayList<>();
    private ArrayList<MenuActive> contextMenusContent = new ArrayList<>();
    private Map<Integer, MenuLinks> mainMenus = new LinkedHashMap<>();
    private Map<Integer, MenuLinks> secondoryMenus = new LinkedHashMap<>();
    private ActionBarDrawerToggle toggle;
    private Toolbar toolbar;
    private DrawerLayout drawer;
    private RelativeLayout headerTitleLayout;
    private ImageView headerTitleArrow;
    private final ExecutorService threadPool = Executors.newCachedThreadPool();
    private View headerView, footerView;
    private Menu sideNavigationMenu;
    private ReactRootView mReactRootView;
    private ReactInstanceManager mReactInstanceManager;
    private ImageButton contextMenuButton;
    private CustomTextView titleTextView;
    private View contentView;
    private MenuListAdapter contextMenuListAdapter;
    private TextView versionText;
    private View dimmedOverlayView;
    private ListView drawerMenuListView;
    private DrawerMenuListAdapter drawerMenuListAdapter;
    private ReactContext reactContext;
    private int selectedID = 0;

    //image view for showing user profile_icon image
    ImageView userProfileImg;

    ImageButton rightLogo;
    // @minu For portions of objectives and goals.
    boolean showStat;
    // @minu Show employee image or static done button on the navigation bar.
    boolean isStatic;
    String title = "";
    //@minu Declare and initialize variable to store time
    long preNavClick = 0;
    private int surveyMenuIndex = 1;
    private int askMenuIndex = 5;


    //Changes for CX

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        contentView = LayoutInflater.from(this).inflate(R.layout.react_home_activity, null);

        QPUIContext.getInstance().initTypeface(this);
        setContentView(contentView);
        initReactView();
        toolbar = (Toolbar) findViewById(R.id.toolbar);
        setSupportActionBar(toolbar);
        setTitle("");
        contextMenuButton = (ImageButton) toolbar.findViewById(R.id.menuButton);
        titleTextView = (CustomTextView) toolbar.findViewById(R.id.titleTextView);
        contextMenuButton.setVisibility(View.GONE);
        rightLogo = (ImageButton) toolbar.findViewById(R.id.rightLogo);
        rightLogo.setVisibility(View.GONE);
        rightLogo.setOnClickListener(this);

        userProfileImg = (ImageView) toolbar.findViewById(R.id.userProfileImg);
        userProfileImg.setVisibility(View.GONE);

        contextMenuButton.setOnClickListener(this);
//        contextMenuButton.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View v) {
//                showPopupWindow();
//            }
//        });

        drawer = (DrawerLayout) findViewById(R.id.drawer_layout);
        versionText = (TextView) drawer.findViewById(R.id.versionText);

        versionText.setText(getString(R.string.version) + " " + getAppVersionName());
        toggle = new ActionBarDrawerToggle(
                this, drawer, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawer.setDrawerListener(toggle);
        toggle.syncState();

        navigationView = (NavigationView) findViewById(R.id.nav_view);
        headerView = navigationView.getHeaderView(0);
        drawerMenuListView = (ListView) navigationView.findViewById(R.id.drawerMenuListView);
        footerView = navigationView.findViewById(R.id.footerView);
        sideNavigationMenu = navigationView.getMenu();
        addMainMenu();

        headerTitleLayout = (RelativeLayout) headerView.findViewById(R.id.headerTitleView);
        headerTitleArrow = (ImageView) headerView.findViewById(R.id.headerTitleArrow);
        dimmedOverlayView = findViewById(R.id.dimmedOverlayView);
        headerTitleLayout.setTag(ORIGINAL_MENU);
        headerTitleLayout.setOnClickListener(headerToggleListener);
        setupCompanyLogo();
        ((RelativeLayout) findViewById(R.id.content_home)).addView(mReactRootView, 0,
                new RelativeLayout.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.MATCH_PARENT));
        createPopupWindow();
        askForOverlayPermission();
        startReactApplication(savedInstanceState != null);
        onDrawerMenuSelected(resolveMenuIfFromPush());


    }

    private int resolveMenuIfFromPush() {
        if (getIntent() != null && getIntent().getExtras() != null) {
            String launchScrene = getIntent().getExtras().getString("launchScreen");
            if ("welcomeScreen".equals(launchScrene)) { //From Pulse
               return 5;
            }
            if("Surveys".equals(getIntent().getExtras().getString("launchScreen"))){
                return surveyMenuIndex;

            }
        }

        return 0;
    }

    @Override
    public void onClick(View v) {

        if (contextMenus.size() > 0) {
            showPopupWindow();

        } else if (isStatic) { // @minu Done button action in the review summary page.
            WritableMap writableMap = new WritableNativeMap();
            writableMap.putString("DoneAction", "");
            sendNativeEventToReact("DoneAction", writableMap);
            isStatic = false;

        } else if ((v.getId() == R.id.rightLogo && showStat)) {// @minu Context menu action to show filter options for objectives and goals.
            WritableMap writableMap = new WritableNativeMap();
            writableMap.putString("ObjAction", "");
            sendNativeEventToReact("ObjAction", writableMap);

        } else if ((v.getId() == R.id.rightLogo) && !showStat) {// @minu Context menu action to show edit option for objectives and goals.
            WritableMap writableMap = new WritableNativeMap();
            writableMap.putString("ObjEditMenu", "");
            sendNativeEventToReact("ObjEditMenu", writableMap);

        }
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        outState.putBoolean("FromLogin", false);
        super.onSaveInstanceState(outState);
    }

    @TargetApi(Build.VERSION_CODES.M)
    private void askForOverlayPermission() {
        if(Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            PermissionUtils.checkAllPermissions(this);
        }

    }

    @Override
    public void requestPermissions(String[] permissions, int requestCode, PermissionListener listener) {
        int currentapiVersion = Build.VERSION.SDK_INT;
        if (currentapiVersion >= Build.VERSION_CODES.M) {
            this.requestPermissions(permissions, requestCode);
        }

    }


    @Override
    public void onReactContextInitialized(ReactContext context) {

        this.reactContext = context;
        // Note: Cannot assume react-context exists cause this is an async dispatched service.
        if (reactContext != null && reactContext.hasActiveCatalystInstance()) {
            //Getting gcm token on main thread causes an exception
            Thread t = new Thread(new Runnable() {
                @Override
                public void run() {
                    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                            .emit(TOKEN_RECEIVED_EVENT_NAME, ((QPGcmToken) ((CoreApplication) getApplication())
                                    .getGcmToken(ReactHomeActivity.this)).getToken());
                }
            });
            t.start();
        }
        setLanguageId();
    }

    private void startReactApplication(boolean savedInstanceNotNull) {
        Bundle launchOptions = new Bundle();
        AppUser appUser = AppUser.loadFromContext(getApplicationContext());
        launchOptions.putString("APP_NAME", getString(R.string.app_name).replace("\n", " "));
        launchOptions.putLong("USER_ID", appUser.ID);
        launchOptions.putString("HAS_LOCATION_SURVEY", ""+getResources().getBoolean(R.bool.has_location_surveys));
        launchOptions.putString("BASE_URL", appUser.baseURL);

        /*Bundle bundle = new Bundle();

        bundle.putLong("ID", appUser.ID);
        bundle.putString("emailID", appUser.emailAddress);
        bundle.putString("subTitle", appUser.subTitle);
        bundle.putString("password", appUser.password);
        bundle.putString("firstName", appUser.firstName);
        bundle.putString("lastName", appUser.lastName);
        bundle.putLong("panelID", appUser.panelID);
        bundle.putLong("parentMemberID", appUser.parentMemberID);
        bundle.putString("profilePic", appUser.mainMenu.profileImageUrl);
        bundle.putString("APP_NAME", getString(R.string.app_name).replace("\n", " "));
        bundle.putString("collaborateTabMenu", new JSONArray(Arrays.asList(getResources().getStringArray(R.array.collaborate_tab_menu))).toString());
        bundle.putString("topicsTabMenu",new JSONArray(Arrays.asList(getResources().getStringArray(R.array.topics_menu))).toString());
        bundle.putString("ideaboardMenu",new JSONArray(Arrays.asList(getResources().getStringArray(R.array.ideaboard_menu))).toString());
        bundle.putString("useTranslationsForTabs",getResources().getBoolean(R.bool.use_translation_for_tabs)+"");
        bundle.putString("profileTabMenu", new JSONArray(Arrays.asList(getResources().getStringArray(R.array.profile_tab_menu))).toString());*/

        //launchOptions.putBundle("APP_USER", bundle);
        if (getIntent() != null && getIntent().getExtras() != null) {
            launchOptions.putString("scene", getIntent().getExtras().getString("launchScreen"));
        } else {
            launchOptions.putString("scene","home");
        }

        launchOptions.putString("APP_VERSION", getAppVersionName());
        boolean fromLogin = savedInstanceNotNull ? false : getIntent().getBooleanExtra("FromLogin", false);
        launchOptions.putBoolean("fromLogin", fromLogin);
        launchOptions.putString("LANGUAGE_ID", CoreApplication.getSavedLocaleLanguage());
        mReactRootView.startReactApplication(mReactInstanceManager, "ReactApp", launchOptions);
    }

    private String getAppVersionName() {
        String version = "1.0";
        try {
            PackageManager manager = getPackageManager();
            PackageInfo info = manager.getPackageInfo(
                    getPackageName(), 0);
            version = info.versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return version;
    }

    private void setupCompanyLogo() {
        ImageView logoImageView = (ImageView) headerView.findViewById(R.id.imageView);

        AppUser appUser = AppUser.loadFromContext(CoreApplication.getContext());
        if (StringUtil.isNotEmpty(appUser.mainMenu.companyLogoUrl)) {
            Picasso.with(this)
                    .load(getString(R.string.base_url) + appUser.mainMenu.companyLogoUrl)
                    .placeholder(R.drawable.side_logo)
                    .error(R.drawable.side_logo)
                    .into(logoImageView);


        } /*else if (!getResources().getBoolean(R.bool.is_white_label)) {
            footerView.findViewById(R.id.poweredByIcon).setVisibility(View.GONE);
        }*/
    }

    private void initReactView() {
        mReactRootView = new ReactRootView(this);
        mReactInstanceManager = ReactInstanceManager.builder()
                .setApplication(getApplication())
                .setBundleAssetName("index.android.bundle")
                .setJSMainModulePath("index.android")
                .addPackage(new MainReactPackage())
                .addPackage(new RNNotificationsPackage(getApplication()))
                .addPackage(new ReactAppCallbackModules(this))
                .addPackage(new WebViewBridgePackage())
                .addPackage(new MPAndroidChartPackage())
                .addPackage(new RNFSPackage())
                .addPackage(new AndroidKeyboardAdjustPackage(this))
                .addPackage(new ReactNativeWheelPickerPackage())
                .addPackage(new ReanimatedPackage())
                .addPackage(new RNGestureHandlerPackage())
                .addPackage(new RNCWebViewPackage())
                .setUseDeveloperSupport(BuildConfig.DEBUG)
                .setInitialLifecycleState(LifecycleState.RESUMED)
                .build();
        mReactInstanceManager.addReactInstanceEventListener(this);

    }

    private void sendNativeEventToReact(String eventName, WritableMap params) {
        if (this.reactContext == null) {
            reactContext = mReactInstanceManager.getCurrentReactContext();
        }
        if (reactContext != null) {
            reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit(eventName, params);
        }
    }

    @Override
    protected void onStart() {
        super.onStart();


    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch(requestCode){

        }
        mReactInstanceManager.onActivityResult(this,requestCode,resultCode,data);
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        super.onConfigurationChanged(newConfig);
        adjustPopupWindowDimensions();
        if (contextMenuWindow.isShowing()) {
            dismissPopupWindow();

            contentView.postDelayed(new Runnable() {
                @Override
                public void run() {
                    showPopupWindow();
                }
            }, 300);
        }

    }

    private void adjustPopupWindowDimensions() {
        Display display = getWindowManager().getDefaultDisplay();
        int width = display.getWidth();
        int height = display.getHeight();
        if (getResources().getBoolean(R.bool.extended_context_menu)) {
            contextMenuWindow.setWidth((int) (Math.ceil(width * 0.8)));
            //contextMenuWindow.setWindowLayoutMode(ViewGroup.LayoutParams.WRAP_CONTENT, ViewGroup.LayoutParams.MATCH_PARENT);
            contextMenuWindow.setHeight(ListPopupWindow.MATCH_PARENT);

        } else {
            contextMenuWindow.setWidth((int) (Math.ceil(width * 0.4)));
            contextMenuWindow.setHeight((int) (Math.ceil(height * 0.8)));
        }

    }

    private void addMainMenu() {
        sideNavigationMenu.clear();
        Resources resources = CoreApplication.getContext().getResources();
        Log.i("Sachin", "Locale is- "+Locale.getDefault().getDisplayName());
        TypedArray menuTexts = resources.obtainTypedArray(R.array.primary_side_menu_texts);
        TypedArray menuIcons = resources.obtainTypedArray(R.array.primary_side_menu_icons);
        TypedArray menuSceneKeys = resources.obtainTypedArray(R.array.primary_side_menu_scene_keys);
        TypedArray menuTypes = resources.obtainTypedArray(R.array.primary_side_menu_type);
        ArrayList<MenuLinks> menuItems = new ArrayList<>();
        for (int i = 0; i < menuTexts.length(); i++) {
            MenuLinks menuLinks = new MenuLinks();
            menuLinks.title = menuTexts.getString(i);
            menuLinks.icon  = menuIcons.getDrawable(i);
            menuLinks.key = menuSceneKeys.getString(i);
            if(menuLinks.key.equalsIgnoreCase("surveys")){
                surveyMenuIndex = i;
            }
            if(menuLinks.key.equalsIgnoreCase("Ask")) {
                askMenuIndex = i;
            }
            menuLinks.type = MenuType.resolve(menuTypes.getString(i));
            menuLinks.id = i;
            menuItems.add(menuLinks);
        }

        AppUser appUser = AppUser.loadFromContext(CoreApplication.getContext());
        int nameIndex = -1;
        int companyIndex = -1;
        int emailIndex = -1;


        if (StringUtil.isNotEmpty(appUser.firstName) || StringUtil.isNotEmpty(appUser.lastName)) {
            MenuLinks menuLinks4 = new MenuLinks();
            menuLinks4.name = "firstName lastName";
            menuLinks4.title = (StringUtil.isNotEmpty(appUser.firstName) ? appUser.firstName : "")
                    + " " + (StringUtil.isNotEmpty(appUser.lastName) ? appUser.lastName : "");
            menuLinks4.type = MenuType.LINK;
            menuItems.add(menuLinks4);
            nameIndex = menuItems.size() - 1;
        }
        if (StringUtil.isNotEmpty(appUser.organizationName)) {
            MenuLinks menuLinks5 = new MenuLinks();
            menuLinks5.name = "Organization Name";
            menuLinks5.title = appUser.organizationName;
            menuLinks5.type = MenuType.LINK;
            menuItems.add(menuLinks5);
            companyIndex = menuItems.size() - 1;
        }
        MenuLinks menuLinks6 = new MenuLinks();
        menuLinks6.name = "Email Address";
        menuLinks6.title = appUser.emailAddress;
        menuLinks6.type = MenuType.LINK;
        menuItems.add(menuLinks6);
        emailIndex = menuItems.size() - 1;
        for (int i = 0; i < menuItems.size(); i++) {
            MenuLinks menuLinks = menuItems.get(i);
            if (i < menuTexts.length()) {
                mainMenus.put(i, menuLinks);
            } else {
                secondoryMenus.put(i, menuLinks);
            }
        }
        mainMenus.get(0).active = true;
        selectedID = 0;
        if (nameIndex != -1) {
            menuItems.get(nameIndex).icon = getResources().getDrawable(R.drawable.user_icon_selector);
            menuItems.get(nameIndex).enabled = true;
        }
        if (companyIndex != -1) {
            menuItems.get(companyIndex).icon = getResources().getDrawable(R.drawable.company_icon_selector);
            menuItems.get(companyIndex).enabled = false;
        }
        menuItems.get(emailIndex).icon = getResources().getDrawable(R.drawable.at_icon_selector);
        menuItems.get(emailIndex).enabled = false;

        TextView title = (TextView) headerView.findViewById(R.id.title);
        title.setText(appUser.emailAddress);
        TextView subTitle = (TextView) headerView.findViewById(R.id.subTitle);
        subTitle.setText(StringUtil.isNotEmpty(appUser.organizationName) ?
                appUser.organizationName : "");
        drawerMenuListAdapter = new DrawerMenuListAdapter(mainMenus);
        drawerMenuListView.setAdapter(drawerMenuListAdapter);
        drawerMenuListView.setItemChecked(0, true);

        /* App language pop-up*/
        Button appLanguage = footerView.findViewById(R.id.app_language_button);
        if(!getString(R.string.app_name).equalsIgnoreCase("Pulse")) {
            appLanguage.setText(CoreApplication.getPreferredLanguage(getApplicationContext()));
            appLanguage.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    drawer.closeDrawer(GravityCompat.START);
                    WritableMap writableMap = new WritableNativeMap();
                    //writableMap.putString("Logout", "true");
                    sendNativeEventToReact("LanguagePicker", writableMap);
                }
            });
        } else {
            appLanguage.setVisibility(View.INVISIBLE);
        }
    }

    /**
     *
     */
    private class DrawerMenuListAdapter extends BaseAdapter {
        public void setMenuLinksArrayList(Map<Integer, MenuLinks> menuLinksArrayList) {
            this.menuLinksArrayList = menuLinksArrayList;
            updateIDs();
        }

        private Map<Integer, MenuLinks> menuLinksArrayList = new LinkedHashMap<>();
        private ArrayList<Integer> ids = new ArrayList<>();

        private DrawerMenuListAdapter(Map<Integer, MenuLinks> menuLinksArrayList) {
            this.menuLinksArrayList = menuLinksArrayList;
            updateIDs();
        }

        private void updateIDs() {
            Set<Integer> keySet = menuLinksArrayList.keySet();
            ids.clear();
            Iterator<Integer> it = keySet.iterator();
            while (it.hasNext()) {
                ids.add(it.next());
            }
        }

        @Override
        public int getCount() {
            return ids.size();
        }

        @Override
        public Object getItem(int position) {
            return menuLinksArrayList.get(ids.get(position));
        }

        @Override
        public long getItemId(int position) {
            return ids.get(position);
        }

        @Override
        public View getView(final int position, View convertView, ViewGroup parent) {
            MenuLinks menuLinks = menuLinksArrayList.get(ids.get(position));
            CheckableLinearLayout view = (CheckableLinearLayout) LayoutInflater.from(ReactHomeActivity.this)
                    .inflate(R.layout.drawer_menu_item, null);
            CustomTextView title = (CustomTextView) view.findViewById(R.id.menuTitle);
            CustomTextView badge = (CustomTextView) view.findViewById(R.id.menuBadge);
            if (menuLinks.type == MenuType.DYNAMIC_WITH_BADGE) {
                badge.setVisibility(View.VISIBLE);
                badge.setText("" + menuLinks.badge);
            } else {
                badge.setVisibility(View.GONE);
            }
            ImageView icon = (ImageView) view.findViewById(R.id.menuIcon);
            title.setText(menuLinks.title);
            icon.setImageDrawable(menuLinks.icon);
            view.setId(position);
            if (menuLinks.active) {
                view.setChecked(true);
                icon.setSelected(true);
                view.setBackgroundResource(R.drawable.menu_item_selected);
            } else {
                view.setChecked(false);
                icon.setSelected(false);
                view.setBackgroundResource(R.drawable.menu_item_normal);
            }
            view.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    onDrawerMenuSelected(ids.get(position));
                }
            });
            return view;
        }
    }


    public boolean onDrawerMenuSelected(int id) {
        // Handle navigation view item clicks here.
        MenuLinks menuLinks = headerTitleLayout.getTag().equals(ORIGINAL_MENU) ?
                mainMenus.get(id) : secondoryMenus.get(id);
        closeDrawer();
        switch (menuLinks.type) {
            case HOME:
            case DYNAMIC_WITH_BADGE:
            case DYNAMIC:
                goToScrene(menuLinks.key, menuLinks.id);

                break;
            case LOGOUT:
                showLogoutAlert();
                break;

                //TODO : following 2 options need to be removed.
            case LINK:
                try {
                   // GeoUtils.exportDatabase(this, getString(R.string.app_name));
                    Log.i("Sachin", "Selected Menu- "+id);
                    //uploadLocationResult();

                }catch (Exception e){
                    e.printStackTrace();
                }
                break;
            case SHARE:
                try {
                     //GeoUtils.exportDatabase(this, getString(R.string.app_name));
                }catch (Exception e){
                    e.printStackTrace();
                }

                break;
            default:
                break;

        }

        return true;
    }


    private void setLanguageId(){
        WritableMap writableMap = new WritableNativeMap();
        writableMap.putString("languageId", "en");
        sendNativeEventToReact("updateLanguageId", writableMap);
    }

    private void goToScrene(String key, int id) {
        WritableMap writableMap = new WritableNativeMap();
        writableMap.putString("Scene", key);
        writableMap.putString("Title", mainMenus.get(id).title);
        sendNativeEventToReact("SceneTransition", writableMap);
        mainMenus.get(selectedID).active = false;
        mainMenus.get(id).active = true;
        selectedID = id;
        drawerMenuListAdapter.notifyDataSetChanged();

    }

    private void goToHome() {
        navigationView.setCheckedItem(0);

    }

    private void closeDrawer() {
        drawer.closeDrawer(GravityCompat.START);
    }

    /**
     *
     */
    private void showLogoutAlert() {
        AlertDialog.Builder builder =
                new AlertDialog.Builder(this, R.style.AppCompatAlertDialogStyle);
        builder.setTitle(getString(R.string.logout));
        builder.setMessage(getString(R.string.logout_message));
        builder.setPositiveButton(getString(R.string.yes), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                if(getResources().getBoolean(R.bool.has_logout_api)){
                    uploadLocationResponsesAndLogout();
                }
                else{
                    doLogoutPostProcedure();
                }

            }
        });
        builder.setNegativeButton(getString(R.string.cancel), new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                navigationView.setCheckedItem(0);
            }
        });
        builder.show();
    }

    public void uploadLocationResponsesAndLogout() {
        final ProgressDialog progressBar = new ProgressDialog(ReactHomeActivity.this);
        progressBar.setCancelable(false);
        progressBar.setTitle("Log out");
        progressBar.setMessage("Logging out...");
        progressBar.show();

        doLogoutPostProcedure();

        if (progressBar != null && progressBar.isShowing()) {
            progressBar.dismiss();
        }
    }

    private void doLogoutPostProcedure(){
        WritableMap writableMap = new WritableNativeMap();
        writableMap.putString("Logout", "true");
        sendNativeEventToReact("Logout", writableMap);
        mReactInstanceManager.detachRootView(mReactRootView);
        goToLogin();
        AppUser.clearSavedUserData(CoreApplication.getContext(),false);
        CoreApplication.clearLanguagePreference();

        //Stop Geo fence service
        //LocationMonitorInterface.getInstance(ReactHomeActivity.this).stopAllLocationRelatedActivities();
    }

    /**
     *
     */
    private void goToLogin() {
        AppUser appUser = AppUser.loadFromContext(CoreApplication.getContext());
        Intent intent;
        if (appUser.socialLoggedIn) {
            intent = new Intent(ReactHomeActivity.this, SocialLoginActivity.class);
        }
        else if(getResources().getBoolean(R.bool.has_company_code_screen)){
            intent = new Intent(ReactHomeActivity.this, CompanyCodeActivity.class);
        }
        else{
            intent = new Intent(ReactHomeActivity.this, LoginActivity.class);
        }
        intent.putExtra("LoggedOut", true);
        startActivity(intent);
        finish();
        overridePendingTransition(Transition.EXIT.getAnimationStart(), Transition.EXIT.getAnimationEnd());

    }

    public void updateObj(String actionBarJsonString) {

        WebPage webPage = WebPage.fromJSON(com.alibaba.fastjson.JSONObject.parseObject(actionBarJsonString));
        loadOptionsMenuActive(webPage.contextMenuContent.menuItems);
    }

    public void updateActionBar(String json) {
        WebPage webPage = WebPage.fromJSON(JSON.parseObject(json));
        //setTitle("");
        // titleTextView.setText(webPage.title, TextView.BufferType.NORMAL, Typeface.NORMAL);
        showStat = webPage.showStat;

        //rightLogo.setBackgroundResource(0);
        if (!webPage.title.isEmpty()) {
            titleTextView.setText(webPage.title, TextView.BufferType.NORMAL, Typeface.NORMAL);
            title = webPage.title;
        }
        //@minu Show icon in navigation bar in Performance Review
        if (!webPage.image.isEmpty()) {
            rightLogo.setVisibility(View.VISIBLE);
            if (webPage.isStatic) {
                rightLogo.setClickable(true);
                isStatic = webPage.isStatic;
                //  rightLogo.setBackgroundResource(0);

               // rightLogo.setBackgroundResource(0);

                rightLogo.setImageDrawable(getResources().getDrawable(R.drawable.ic_action_name));
                rightLogo.setBackgroundColor(getResources().getColor(android.R.color.transparent));
                userProfileImg.setVisibility(View.GONE);
            } else {
                userProfileImg.setVisibility(View.VISIBLE);
                //userProfileImg.setBackground(getResources().getDrawable(R.drawable.round));
                Picasso.with(this).load(webPage.image).resize(50, 50).transform(new CircleTransform()).into(userProfileImg);
                rightLogo.setVisibility(View.GONE);
                rightLogo.setBackground(getResources().getDrawable(R.drawable.round));
                //Picasso.with(this).load(webPage.image).resize(40, 40).into(rightLogo);
                rightLogo.setClickable(false);
            }
        } else {
            //@minu Show or hide menu in navigation
            userProfileImg.setVisibility(View.GONE);
            if (webPage.showMenu) {
                rightLogo.setClickable(true);
                rightLogo.setVisibility(View.VISIBLE);
               // rightLogo.setBackgroundResource(0);
                int res = getResources().getIdentifier("menu_icon","drawable", this.getPackageName());
                if(webPage.showCloseButton) {
                    rightLogo.setImageResource(R.drawable.close_icon);
                }
                else{
                    rightLogo.setImageResource(R.drawable.menu_icon);
                }
            }
            else{
                //rightLogo.setBackgroundResource(0);
                rightLogo.setVisibility(View.GONE);
            }
        }

        loadOptionsMenu(webPage.contextMenu.menuItems);
        if (webPage.memberCount >= 0) {
            updateMemberCount(webPage.memberCount);
        }
    }

    private void updateMemberCount(int memerCount) {
        for (int i = 0; i < mainMenus.size(); i++) {
            MenuLinks menuLinks = mainMenus.get(i);
            if (menuLinks.type == MenuType.DYNAMIC_WITH_BADGE) {
                menuLinks.badge = memerCount;
                drawerMenuListAdapter.notifyDataSetChanged();
                break;
            }
        }

    }

    private void loadOptionsMenu(ArrayList<MenuLinks> menuLinks) {
        Collections.sort(menuLinks, MenuLinks.menuLinksComparator);
        this.contextMenus = menuLinks;
        contextMenuListAdapter.notifyDataSetChanged();
    }

    private void loadOptionsMenuActive(ArrayList<MenuActive> menuActives) {
        this.contextMenusContent = menuActives;
        if (contextMenusContent.size() > 0) {
            showPopupWindow();
        }
        contextMenuListAdapter.notifyDataSetChanged();
    }

    public void showBackButton(boolean enabled) {

        if (enabled) {
            getSupportActionBar().setDisplayHomeAsUpEnabled(true);
            toolbar.setNavigationOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {

                    onBackPressed();

                }
            });
            drawer.setDrawerLockMode(DrawerLayout.LOCK_MODE_LOCKED_CLOSED);
        } else {
            drawer.setDrawerLockMode(DrawerLayout.LOCK_MODE_UNLOCKED);
            toggle.setDrawerIndicatorEnabled(true);
            getSupportActionBar().setDisplayShowHomeEnabled(true);
            getSupportActionBar().setDisplayHomeAsUpEnabled(false);
            toolbar.setNavigationOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v) {
                    drawer.openDrawer(GravityCompat.START);
                }
            });
            toggle.syncState();
        }


    }

    private String getHomeURL() {

        return getString(R.string.base_url) + mainMenus.get(0).url;
    }


    private PopupWindow contextMenuWindow;

    private void createPopupWindow() {
        contextMenuWindow = new PopupWindow();
        adjustPopupWindowDimensions();
        View popupView = LayoutInflater.from(this).inflate(R.layout.context_menu_layout, null);

        ImageView backButton = (ImageView) popupView.findViewById(R.id.menuCloseButton);
        backButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onBackPressed();
            }
        });

        //ImageView poweredByIcon = (ImageView) popupView.findViewById(R.id.poweredByIcon);
        //poweredByIcon.setImageResource(R.drawable.nav_footer_icon);

        CustomTextView versionText = (CustomTextView) popupView.findViewById(R.id.versionText);
        versionText.setText("Version " + getAppVersionName());
        contextMenuWindow.setContentView(popupView);
        contextMenuWindow.setAnimationStyle(android.R.style.Animation_Dialog);
        dimmedOverlayView.setVisibility(View.INVISIBLE);

        if(SDK_INT >= 21) {
            contextMenuWindow.setElevation(Utils.convertDpToPixel(12,this));
        }

        ListView menuList = (ListView) popupView.findViewById(R.id.menuListView);
        contextMenuListAdapter = new MenuListAdapter();
        menuList.setAdapter(contextMenuListAdapter);


    }

    private void dismissPopupWindow() {
        //contextMenuWindow.setAnimationStyle(R.style.PopupAnimationStyle);
        contextMenuWindow.dismiss();
        dimmedOverlayView.setVisibility(View.INVISIBLE);
    }
    private void showPopupWindow(){
        contextMenuWindow.showAtLocation(contentView, Gravity.RIGHT| Gravity.TOP, 0,(int)Utils.convertDpToPixel(30,this));
        dimmedOverlayView.setVisibility(View.VISIBLE);

    }


    private class MenuListAdapter extends BaseAdapter {

        @Override
        public Object getItem(int position) {
            if (contextMenusContent.size() > 0) {
                return contextMenusContent.get(position);
            } else {
                return contextMenus.get(position);
            }
        }

        @Override
        public int getCount() {
            if (contextMenus.size() > 0) {
                return contextMenus.size();
            } else if (contextMenusContent.size() > 0) {
                return contextMenusContent.size();
            } else {
                return 0;
            }
        }

        @Override
        public View getView(int position, View convertView, ViewGroup parent) {
            CheckableLinearLayout view = null;
            if (contextMenus.size() > 0) {
                MenuLinks menuLinks = contextMenus.get(position);
                if (getResources().getBoolean(R.bool.extended_context_menu)) {
                    view = (CheckableLinearLayout) LayoutInflater.from(ReactHomeActivity.this)
                            .inflate(R.layout.context_menu_item_extended, null);
                } else {
                    view = (CheckableLinearLayout) LayoutInflater.from(ReactHomeActivity.this)
                            .inflate(R.layout.context_menu_item, null);
                }
                CheckedTextView title = (CheckedTextView) view.findViewById(R.id.menuItemText);
                if (StringUtil.isNotEmpty(menuLinks.category)) {
                    title.setText(menuLinks.category + ", " + menuLinks.title);
                } else {
                    title.setText(menuLinks.title);
                }
                view.setId(position);
                view.setOnClickListener(contextMenuItemClickListener);
                if (menuLinks.active) {
                    view.setChecked(true);
                    view.setBackgroundResource(R.drawable.context_menu_item_selected);
                } else {
                    view.setChecked(false);
                    view.setBackgroundResource(R.drawable.menu_item_normal);
                }

                CustomTextView questionTitle = (CustomTextView) view.findViewById(R.id.menuTitleText);
                if (questionTitle != null) {
                    questionTitle.setText(menuLinks.questionTitle);
                }
                CustomTextView totalResponses = (CustomTextView) view.findViewById(R.id.responsesText);
                if (questionTitle != null) {
                    totalResponses.setText(menuLinks.totalResponse + " " + (menuLinks.totalResponse > 1 ? "Responses" : "Response"));
                }


            } else {
                view = (CheckableLinearLayout) LayoutInflater.from(ReactHomeActivity.this)
                        .inflate(R.layout.context_menu_item, null);

                CheckedTextView title = (CheckedTextView) view.findViewById(R.id.menuItemText1);
                CheckedTextView activeTv = (CheckedTextView) view.findViewById(R.id.menuText);
                final CheckableLinearLayout llactive = (CheckableLinearLayout) view.findViewById(R.id.active);
                final CheckableLinearLayout llarchieved = (CheckableLinearLayout) view.findViewById(R.id.archieved);

                CheckedTextView title2 = (CheckedTextView) view.findViewById(R.id.menuItemText2);
                MenuActive menuActive = contextMenusContent.get(position);

                if (title != null) {
                    if (showStat) {
                        title.setVisibility(View.VISIBLE);
                        llarchieved.setVisibility(View.VISIBLE);
                        if (menuActive.selected.equals("active")) {
                            llactive.setChecked(true);
                            llarchieved.setChecked(false);
                            llactive.setBackgroundResource(R.drawable.selected_state);
                            llarchieved.setBackgroundResource(R.drawable.menu_item_normal);
                        } else {
                            llactive.setChecked(false);
                            llarchieved.setChecked(true);
                            llarchieved.setBackgroundResource(R.drawable.selected_state);
                            llactive.setBackgroundResource(R.drawable.menu_item_normal);
                        }
                        title.setText(menuActive.activeCount);
                        title2.setText(menuActive.archieveCount);
                    } else {
                        activeTv.setText((menuActive.edit));

                        title.setVisibility(View.GONE);
                        llarchieved.setVisibility(View.GONE);
                    }
                }
                //@minu Handle click event for GoalsFilterAction
                llactive.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        if (showStat) {
                            llactive.setChecked(true);
                            llarchieved.setChecked(false);
                            llactive.setBackgroundResource(R.drawable.selected_state);
                            llarchieved.setBackgroundResource(R.drawable.menu_item_normal);
                            final WritableMap writableMap = new WritableNativeMap();
                            writableMap.putString("filter", "active");
                            sendNativeEventToReact("GoalsFilterAction", writableMap);
                        } else {
                            final WritableMap writableMap = new WritableNativeMap();
                            writableMap.putString("ObjEditAction", "");
                            sendNativeEventToReact("ObjEditAction", writableMap);
                        }
                        dismissPopupWindow();
                    }
                });
                llarchieved.setOnClickListener(new View.OnClickListener() {
                    public void onClick(View v) {
                        llactive.setChecked(false);
                        llarchieved.setChecked(true);
                        llarchieved.setBackgroundResource(R.drawable.selected_state);
                        llactive.setBackgroundResource(R.drawable.menu_item_normal);
                        final WritableMap writableMap = new WritableNativeMap();
                        writableMap.putString("filter", "archived");
                        sendNativeEventToReact("GoalsFilterAction", writableMap);
                        dismissPopupWindow();
                    }
                });
            }

            return view;
        }

        @Override
        public long getItemId(int position) {
            if (contextMenus.size() > 0) {
                return contextMenus.get(position).id;
            } else {
                return 0;
            }
        }

        @Override
        public void notifyDataSetChanged() {
            super.notifyDataSetChanged();
            contextMenuButton.setVisibility(contextMenus.size() > 0 ? View.VISIBLE : View.GONE);
        }
    }

    private View.OnClickListener contextMenuItemClickListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            MenuLinks menuLinks = contextMenus.get(v.getId());

            if (menuLinks.type == MenuType.SHARE) {
                Intent sendIntent = new Intent();
                sendIntent.setAction(Intent.ACTION_SEND);
                sendIntent.putExtra(Intent.EXTRA_TEXT, menuLinks.url);
                sendIntent.setType("text/plain");
                startActivity(Intent.createChooser(sendIntent, menuLinks.title));

            } else if (menuLinks.type == MenuType.APP_URL) {
                WritableMap writableMap = new WritableNativeMap();
                writableMap.putString("DATA", menuLinks.data.toString());
                sendNativeEventToReact("ContextMenuItemClick", writableMap);
            }
            dismissPopupWindow();
        }
    };

    @Override
    public void invokeDefaultOnBackPressed() {
        super.onBackPressed();
    }

    @Override
    public void onBackPressed() {
        long postTime = System.currentTimeMillis();
        if (postTime - preNavClick > 500) {
            if (contextMenuWindow != null && contextMenuWindow.isShowing()) {
                dismissPopupWindow();
            } else if (mReactInstanceManager != null) {
                mReactInstanceManager.onBackPressed();
                sendNativeEventToReact("BackEvent", null);

            } else {
                super.onBackPressed();
            }
            preNavClick = postTime;
        }
    }

    @Override
    protected void onPause() {
        super.onPause();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostPause(this);
        }
    }

    @Override
    protected void onResume() {
        super.onResume();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostResume(this, this);

        }
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();

        if (mReactInstanceManager != null) {
            mReactInstanceManager.onHostDestroy(this);
        }
    }


    View.OnClickListener headerToggleListener = new View.OnClickListener() {
        @Override
        public void onClick(View v) {
            headerTitleArrow.clearAnimation();
            if (v.getTag().equals(ORIGINAL_MENU)) {
                ViewCompat.animate(headerTitleArrow).rotation(180).start();
                v.setTag(USER_DETAILS_MENU);
            } else {
                ViewCompat.animate(headerTitleArrow).rotation(0).start();
                v.setTag(ORIGINAL_MENU);
            }
            toggleMenu((int) v.getTag());
        }
    };

    private void toggleMenu(int tag) {
        if (tag == ORIGINAL_MENU) {
            drawerMenuListAdapter.setMenuLinksArrayList(mainMenus);

        } else {
            drawerMenuListAdapter.setMenuLinksArrayList(secondoryMenus);
        }
        drawerMenuListAdapter.notifyDataSetChanged();
    }

    @Override
    public boolean dispatchTouchEvent(MotionEvent ev) {
        if (contextMenuWindow != null && contextMenuWindow.isShowing()) {
            onBackPressed();
            return true;
        }
        return super.dispatchTouchEvent(ev);
    }

    @Override
    public boolean onKeyUp(int keyCode, KeyEvent event) {
        if ((keyCode == KeyEvent.KEYCODE_MENU || keyCode == 22 || keyCode == 21) && mReactInstanceManager != null) {
            mReactInstanceManager.showDevOptionsDialog();
            return true;
        }
        return super.onKeyUp(keyCode, event);
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        if (listener != null) {
            listener.onRequestPermissionsResult(requestCode, permissions, grantResults);
        }
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
    }


    /**
     * @param ctx
     * @param lang
     */
    public static void updateLanguage(Context ctx, String lang) {
        Configuration cfg = new Configuration();
        //SharedPreferences force_pref = PreferenceManager.getDefaultSharedPreferences(ctx);
        //String language = force_pref.getString(FORCE_LOCAL, "");
        String language = "";

        if (TextUtils.isEmpty(language) && lang == null) {
            cfg.locale = Locale.getDefault();

            /*SharedPreferences.Editor edit = force_pref.edit();
            String tmp="";
            tmp=Locale.getDefault().toString().substring(0, 2);

            edit.putString(FORCE_LOCAL, tmp);
            edit.commit();*/

        } else if (lang != null) {
            if (lang.equals("zh-rCH")) {
                cfg.locale = Locale.SIMPLIFIED_CHINESE;
            } else
                cfg.locale = new Locale(lang);

            /*SharedPreferences.Editor edit = force_pref.edit();
            edit.putString(FORCE_LOCAL, lang);
            edit.commit();*/

        } else if (!TextUtils.isEmpty(language)) {
            cfg.locale = new Locale(language);

            }

         ctx.getResources().updateConfiguration(cfg, null);
    }

    @Override
    public void onNewIntent(Intent intent){
        super.onNewIntent(intent);
        Bundle extras = intent.getExtras();
        System.out.println("On NEW INTENT --- > " + extras.toString());
    }

}
