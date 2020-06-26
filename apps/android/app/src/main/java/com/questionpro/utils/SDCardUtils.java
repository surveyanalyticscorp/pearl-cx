package com.questionpro.utils;

import android.content.Context;
import android.os.Environment;

import java.io.File;

/**
 * Created by Dattatraya Kunde on 26/09/17.
 */

public class SDCardUtils {
    private static File externalDir = null;

    /**
     *
     * @param cntx
     * @return
     */
    public static File getExternalDirectory(Context cntx) {
        if (externalDir != null) {
            return externalDir;
        } else {
            boolean mExternalStorageAvailable = false;
            boolean mExternalStorageWriteable = false;
            String state = Environment.getExternalStorageState();
            if (Environment.MEDIA_MOUNTED.equals(state)) {
                // We can read and write the media
                mExternalStorageAvailable = mExternalStorageWriteable = true;
            } else if (Environment.MEDIA_MOUNTED_READ_ONLY.equals(state)) {
                // We can only read the media
                mExternalStorageAvailable = true;
                mExternalStorageWriteable = false;
            } else {
                // Something else is wrong. It may be one of many other states,
                // but all we need
                // to know is we can neither read nor write
                mExternalStorageAvailable = mExternalStorageWriteable = false;
            }

            if (mExternalStorageAvailable && mExternalStorageWriteable) {
                externalDir = cntx.getExternalFilesDir(null);
            }
            return externalDir;
        }
    }
}
