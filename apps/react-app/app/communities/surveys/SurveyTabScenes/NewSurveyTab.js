import React, {Component} from 'react';

import SurveyCategoryList from "../common/SurveyCategoryList";

export default class NewSurveyTab extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {onPress, categories, surveySelected} = this.props;
        return (
            <SurveyCategoryList
                {...this.props}
                selectAction={surveySelected}
                itemLabel="title"
                countLabel="topicCount"
                categories={categories}
                totalCount={0}
                reload={onPress}
            />
        );
    }


}
