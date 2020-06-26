package com.questionpro.networktask;

/**
 * Created by sachinsable on 22/08/16.
 */

public interface ResultHandler {
    void ayncTaskCompleted(Object sender, Object result, boolean hadError);
}
