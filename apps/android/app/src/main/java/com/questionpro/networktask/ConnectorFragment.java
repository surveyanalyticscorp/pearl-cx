package com.questionpro.networktask;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import com.questionpro.network.ProgressUnit;
import com.questionpro.network.ProgressUpdater;

/**
 * Created by sachinsable on 22/08/16.
 */

public class ConnectorFragment extends Fragment {
    private Context context;
    private TaskCallbacks mCallbacks;
    private NetworkTask task;


    /**
     * Callback interface through which the fragment will report the
     * task's progress and results back to the Activity.
     */
    public interface TaskCallbacks {
        void onPreExecute();
        void onPostExecute(boolean success);
    }



    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setRetainInstance(true);
        context = getActivity();
        callTask();
    }

    public void callTask(){
        task = new NetworkTask();
        task.execute();
    }
    /**
     * Hold a reference to the parent Activity so we can report the
     * task's current progress and results. The Android framework
     * will pass us a reference to the newly created Activity after
     * each configuration change.
     */
    @Override
    public void onAttach(Activity activity) {
        super.onAttach(activity);
        mCallbacks = (TaskCallbacks) activity;
    }

    /**
     * Set the callback to null so we don't accidentally leak the
     * Activity instance.
     */
    @Override
    public void onDetach() {
        super.onDetach();
        mCallbacks = null;
    }

    class NetworkTask extends ErrorLoggedAsyncTask<Void, ProgressUnit, Object> implements
            DialogInterface.OnCancelListener, ProgressUpdater {
        private ProgressUnit progressUnit = null;

        @Override
        protected void onPreExecute() {
            super.onPreExecute();
        }

        @Override
        protected void onProgressUpdate(ProgressUnit... values) {
            super.onProgressUpdate(values);
        }

        @Override
        protected Object doInBackgroundInternal(Object... arg) throws Exception {
            return null;
        }

        @Override
        protected void onPostExecute(Object o) {
            super.onPostExecute(o);
        }

        @Override
        public void onCancel(DialogInterface dialog) {

        }

        @Override
        public void updateProgress(ProgressUnit unit) {

        }
    }
}
