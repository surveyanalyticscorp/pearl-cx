
## About
#### QuestionPro feedback survey npm package is used to collect the customer feedback. Capability to integrate it in react native application and trigger feedback survey whenever you want.

## Getting started
### Install the package:
    npm i questionpro-feedback-survey


## Usage
#### Initialization
```JavaScript
    import {initQp, SurveyType} from 'questionpro-feedback-survey';

    let payload = { 
        apiKey: 'api_access_key', //Your API Access Key
        surveyType: SurveyType.Feedback 
    };

    initQp(payload).then(status => {
          console.log('QuestionPro Feedback Survey initialization status: ' + status);
        });
```
<sup>In the case of 'Feedback' type survey, If the CX feedback system has only one survey, the package(SDK) will launch that survey without any addition configuration settings. But, if feedback system has more than one survey and you want launch the specific survey then you need to do some configuration settings. <br />
If the feedback system has more than one survey, then we have to set-up the rules and assign the survey ids to specific custom variable. Please refer the [screenshot](https://www.screencast.com/t/r9cwNogkl) for more details. Then you have to assign this custom variable number to the ```customVarIndex``` at the time of initialization of QuestionPro SDK.</sup>

#### Trigger feedback survey and launch component
```JavaScript
    import {QpFeedbackSurvey} from 'questionpro-feedback-survey';

    <QpFeedbackSurvey
         surveyId={survey_id}
         onSurveyFinished={finishedSurvey} />

    const finishedSurvey = () => {
        //Callback of finish survey or terminate survey.
      };
```

## Initialization payload Props
| Props | Details | Example | Default Value |
| ----- | ------- | ------- | ------------- |
| apiKey | `[Required]` API Access Key which you will get from the QuestionPro system. [How to generate the API key](https://www.questionpro.com/help/customer-experience/generate-api-key-in-cx.html) | -- | -- |
| surveyType | `[Required]` Type of survey whether it is Customer Experience feedback survey or the core survey. | SurveyType.Feedback OR SurveyType.Core | -- |
| customVarIndex | `[Optional]` Index of custom variable on which the survey id is assigned. We have to set this if there are more than one survey in the feedback system.<br /> _Not application if SurveyType is Core._ | 10 | ' ' |
| email | `[Optional]` Respondant email address. If not set this props, the response will be collected as an anonymous. | "john@example.com"  | anonymous |
| firstName | `[Optional]` First name of respondent. | "John" | ' ' |
| lastName | `[Optional]` Last name of respondent. | "john" | ' ' |
| mobile | `[Optional]` Mobile number of respondent. | "+91 222********" | ' ' |
| segmentCode | `[Optional]` Unique code added for each [segment](https://www.questionpro.com/help/customer-experience/cx-segment-overview.html). If the feedback system has more than one segment and you have to map the feedback to particular segment you can set this.<br /> _Not application if SurveyType is Core._ | "S1"  | S1 |
| themeColorHex | `[Optional]` Feedback survey component theme color. | "#007bff"  | #007bff |
| custom variables | `[Optional]` You can use the custom variable to pass the additional details.  | "custom2" : "Whatever text passed here will be stored in custom2"  | ' ' |
