
## About
#### QuestionPro Cx feedback survey SDK(Software Development Kit) to collect the customer feedback. Capability to integrate it in mobile application and trigger feedback survey whenever you want.

## Getting started
### Install the package:
    npm i qp-feedback-survey


## Usage
#### Initialization
```JavaScript
    import {initQp} from 'qp-feedback-survey';

    let payload = { apiKey: 'api_access_key' };//Your API Access Key

    initQp(payload).then(status => {
          console.log('QP Feedback Survey Init status: ' + status);
        });
```

#### Trigger feedback survey and launch component
```JavaScript
    import {QpFeedbackSurvey} from 'qp-feedback-survey';

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
| apiKey | `[Required]` API Access Key of feedback system. | -- | Required field |
| email | `[Optional]` Respondant email address. If not set this props, the response will be collected as an anonymous. | "john@example.com"  | anonymous |
| firstName | `[Optional]` First name of respondent. | "John" | ' ' |
| lastName | `[Optional]` Last name of respondent. | "john" | ' ' |
| mobile | `[Optional]` Mobile number of respondent. | "+91 222********" | ' ' |
| segmentCode | `[Optional]` Unique code added for each [segment](https://www.questionpro.com/help/customer-experience/cx-segment-overview.html "Help File"). | "S1"  | S1 |
| themeColorHex | `[Optional]` Feedback survey component theme color. | "#007bff"  | #007bff |
