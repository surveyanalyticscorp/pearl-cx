/**
 * Created by sachinsable on 17/07/17.
 */
import React,{Component} from 'react';
import ModuleCategoryList from "../common/ModuleCategoryList";
import {Actions} from 'react-native-router-flux';

export default class Ideaboard extends Component {
    constructor(props) {
        super(props);

    }

    render() {

        const {panelIdeaCategories, onPress} = this.props;
        return (
            <ModuleCategoryList
                {...this.props}
                selectAction = {(data)=>{
                    Actions.ideaList(data)
                }}
                itemLabel = "title"
                countLabel = "ideasCount"
                categories = {panelIdeaCategories && panelIdeaCategories.ideaCampaigns? panelIdeaCategories.ideaCampaigns: []}
                totalCount = {panelIdeaCategories && panelIdeaCategories.totalCount? panelIdeaCategories.totalCount: 0}
                reload={onPress}
            />
        );
    }


}