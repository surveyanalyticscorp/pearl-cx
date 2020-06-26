/**
 * Created by sachinsable on 17/07/17.
 */
import React,{Component} from 'react';
import ModuleCategoryList from "../common/ModuleCategoryList";
import {Actions} from 'react-native-router-flux';

export default class TopicCategories extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {panelTopicCategories, onPress, sort} = this.props;
        let panelTopic = panelTopicCategories && panelTopicCategories.categories? panelTopicCategories.categories: []
        if (sort) {
            panelTopic = panelTopic.sort(function (a, b) {
                if (a.name < b.name) return -1;
                else if (a.name > b.name) return 1;
                return 0;
            });
        }
        return (
            <ModuleCategoryList
                {...this.props}
                selectAction = {(data)=>{
                    Actions.topicsList(data)
                }}
                itemLabel = "name"
                countLabel = "topicCount"
                categories = {panelTopic}
                totalCount = {panelTopicCategories && panelTopicCategories.totalCount? panelTopicCategories.totalCount: 0}
                reload={onPress}
            />
        );
    }


}
