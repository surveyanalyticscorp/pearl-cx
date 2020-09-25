## General info
### InAppSurvey_CX

Select your app under Tagerts

Under General > Frameworks And Libraries > Add QPInterceptCXApp.xcframework > Embed And Sign

## Code Examples

In AppDelegate

Add following code

import InAppSurvey_CX

* apiKey: Get your APIKey from your QuestionPro CX account

lazy var cxManager: MobileCX_Library = {
    return MobileCX_Library().initwithAPIKey(apiKey, with: self.window) 
    }()
    
In your view controller where you want to show the in-app survey:
add the following code:

* surveyId: Pass the id of the survey you want to display in your app.

let appDelegate = UIApplication.shared.delegate as! AppDelegate
appDelegate.cxManager.show(inAppSurvey: surveyId, withSuperView: view)
