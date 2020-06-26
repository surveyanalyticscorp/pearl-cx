package com.questionpro.geoFencing.sync;

import android.util.Log;

import com.questionpro.geoFencing.database.LocationResponseDBHelper;
import com.firebase.jobdispatcher.JobParameters;
import com.firebase.jobdispatcher.JobService;

public class QPUploadJobService extends JobService implements QPLocationResultUploadTask.ResultCallback{

    private QPLocationResultUploadTask mBackgroundTask;
    private LocationDatabaseUpdateTask locationDatabaseUpdateTask;
    private JobParameters jobParameters;
    @Override
    public boolean onStartJob(JobParameters jobParameters) {
        this.jobParameters = jobParameters;
        Log.i("TAG", "onStartJob");
        mBackgroundTask = new QPLocationResultUploadTask(getApplicationContext(), this);
        locationDatabaseUpdateTask = new LocationDatabaseUpdateTask(getApplicationContext(),
                new QPLocationResultUploadTask.ResultCallback() {
                    @Override
                    public void onSuccess(Object result) {

                    }

                    @Override
                    public void onFailure(Object error) {

                    }
                });

        mBackgroundTask.execute();
        locationDatabaseUpdateTask.execute();
        return true;
    }

    @Override
    public boolean onStopJob(JobParameters jobParameters) {
        if (mBackgroundTask != null) {
            mBackgroundTask.cancel(true);
        }
        if(locationDatabaseUpdateTask != null){
            locationDatabaseUpdateTask.cancel(true);
        }
        Log.i("TAG", "onStopJob");
        /* true means, we're not done, please reschedule */
        return true;
    }

    @Override
    public void onSuccess(Object result) {
        jobFinished(this.jobParameters,false);
        LocationResponseDBHelper.getInstance(getApplicationContext()).deleteResponses();
    }

    @Override
    public void onFailure(Object error) {
        jobFinished(this.jobParameters,true);
    }
}