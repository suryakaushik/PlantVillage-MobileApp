package com.plantvillage;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

import android.content.Context;
import android.net.ConnectivityManager;
import android.net.Network;
import android.net.NetworkCapabilities;
import android.net.NetworkInfo;
import android.os.Build;
import android.telephony.TelephonyManager;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.WritableMap;

public class UtilBridge extends ReactContextBaseJavaModule  {
    private static ReactApplicationContext currentReactContext;
    public UtilBridge(ReactApplicationContext reactContext) {
        super(reactContext);
        currentReactContext = reactContext;
    }

    @ReactMethod
    public static void isVPNEnabled(String methodtype, Promise promise) {
        System.out.println("isVPNEnabled");
        System.out.println(methodtype);
        Context currentAppContext = currentReactContext.getApplicationContext();
        ConnectivityManager cm = (ConnectivityManager)currentAppContext.getSystemService(Context.CONNECTIVITY_SERVICE);

        if (cm != null) {
            if (Build.VERSION.SDK_INT < 23) {
                final NetworkInfo networkInfo = cm.getActiveNetworkInfo();
                if (networkInfo != null) {
                    if (networkInfo.isConnected() && (networkInfo.getType() == cm.TYPE_VPN)) {
                        promise.resolve("true");
                    } else {
                        promise.resolve("false");
                    }
                }
            } else {
                Network activeNetwork = cm.getActiveNetwork();
                if (activeNetwork != null) {
                    NetworkCapabilities capabilities = cm.getNetworkCapabilities(activeNetwork);
                    if (capabilities!= null && capabilities.hasTransport(NetworkCapabilities.TRANSPORT_VPN)) {
                        promise.resolve("true");
                    } else {
                        promise.resolve("false");
                    }
                }
            }
        }
    }

    @Override
    public String getName() {
        return "UtilBridge";
    }

}
