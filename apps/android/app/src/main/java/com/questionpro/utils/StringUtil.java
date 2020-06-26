package com.questionpro.utils;

/**
 * Created by sachinsable on 28/06/16.
 */
public class StringUtil {
    public static String cleanString (String str) {
        return cleanString(str, true, true);
    }

    public static boolean isEmpty(String val) {
        if (val == null) {
            return true;
        }
        if ("".equals(val.trim())) {
            return true;
        }

        return false;
    }

    public static boolean isNotEmpty(String val) {
        return !isEmpty(val);
    }

    public static String emptyIfNull(String val) {
        return (val == null ? "" : val);
    }


    public static String cleanString(String str, boolean quotes, boolean newline) {

        int i=0,j=0;
        String temp="";
        if(str == null){
            return "";
        }

        if (newline) {

            if(str.indexOf("\n") > -1){
                str = str.replaceAll("\n","");
            }
            if(str.indexOf("\r") > -1){
                str = str.replaceAll("\r","");
            }
        }

        if (quotes) {
            if(str.indexOf("\'") > -1){
                str = str.replaceAll("\'","");
            }
            if(str.indexOf("\"") > -1){
                str = str.replaceAll("\"", "");
            }
        }

        i = str.indexOf('<');
        j = str.indexOf('>');

        while((i >= 0) && (j >= 0) && (j > i) ) {
            temp = str.substring(0, i);
            temp += str.substring(j+1,str.length());
            str = temp;
            i = str.indexOf('<');
            j = str.indexOf('>');

        }

        return str;
    }
}