/**
 * Created by sachinsable on 17/07/17.
 */
import React from 'react';
import BaseComponentWithoutScroll from '../../global/components/BaseComponentWithoutScroll';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {ActionCreators} from '../actions/index';
import TopicCategories from './topics/TopicCategories';
import Ideaboard from './ideaboard/Ideaboard';
import Chat from './chat/Chat';
import I18n from 'react-native-i18n';
import QPTabView from "../QPTabView";
import {Dimensions} from "react-native";

class Collaborations extends BaseComponentWithoutScroll {

    constructor(props) {
        super(props);
        let collaborateTab = global.appUser.collaborateTabMenu;
        let collaborateTabMenu = JSON.parse(collaborateTab);
        let useTranslationForTabs = true;

        if(global.appUser.useTranslationsForTabs){
            useTranslationForTabs = global.appUser.useTranslationsForTabs ==='true';
        }

        let tabMenuOptions = [];
        for(let i=0;i<collaborateTabMenu.length;i++) {
            tabMenuOptions.push({key: this.getRouteKey(collaborateTabMenu[i]), title: useTranslationForTabs?  I18n.t(collaborateTabMenu[i], {locale: props.language})
                                            : collaborateTabMenu[i]});
        }
        this.state = {
            sortList: collaborateTab.includes("discussion") ? true : false,
            index: 0,
            routes: tabMenuOptions,
        };
    }

    getRouteKey(collaborateTab) {
        switch (collaborateTab) {
            case 'topic':
                return '0';
            case "discussion":
                return "0";
            case 'ideaboard':
                return '1';
            case 'chat':
                return '2';
            default:
                return "0";
        }

    }

    componentDidMount() {
    }

    getTopics(data){
        if(!this.props.isLoading) {
            this.props.getPanelTopicCategories(data);
        }
    }
    getIdeaboardDetails(data){
        if(!this.props.isLoading) {
            this.props.getPanelIdeaCategories(data);
        }
    }
    getDiscussions(){
        if(!this.props.isLoading){
            this.props.getPanelDiscussionsList();
        }
    }

    _renderScene = ({route}) => {
        const collaborateTabProps = this.props;
        switch (route.key) {
            case '0':
                return <TopicCategories {...collaborateTabProps}
                                  sort={this.state.sortList}
                                  onPress={(data) => {
                                      this.getTopics(data);
                                  }}/>;
            case '1':
                return <Ideaboard {...collaborateTabProps}
                                  onPress={(data) => {
                                      this.getIdeaboardDetails(data);
                                  }}/>;
            case '2':
                return <Chat {...collaborateTabProps}
                                     onPress={() => {
                                         this.getDiscussions();
                                     }}/>;
            default:
                return null;
        }
    };

    _handleChangeTab = (index) => {
        this.setState({
            index: index,
        });
    };

    renderChild() {
        return (
            <QPTabView
                tabWidth={Dimensions.get('window').width/this.state.routes.length}
                style={this.props.style}
                navigationState={this.state}
                renderScene={this._renderScene}
                onIndexChange={this._handleChangeTab}
            />
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        panelLiveDiscussions: state.panelDiscussionData.body,
        panelIdeaCategories : state.panelIdeaCategories.body,
        panelTopicCategories : state.panelTopicCategories.body,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language : state.language.googleCode,
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Collaborations);
