import React from 'react';
import BaseComponentWithoutScroll from '../../global/components/BaseComponentWithoutScroll';
import MyProfile from './MyProfile';
import ShareProfile from './ShareProfile';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux'
import {ActionCreators} from '../actions/index';
import MyRewards from "./MyRewards";
import I18n from 'react-native-i18n';
import DeviceInfo from "react-native-device-info";
import QPTabView from "../QPTabView";


class Profile extends BaseComponentWithoutScroll {


    constructor(props) {
        super(props);
        // communityStrings.setLanguage(this.props.language);
        let profileTabMenu = JSON.parse(global.appUser.profileTabMenu);
        let tabMenuOptions = [];
        for (let i = 0; i < profileTabMenu.length; i++) {
            tabMenuOptions.push({key: '' + i, title: I18n.t(profileTabMenu[i], {locale: props.language})})
        }

        this.state = {
            index: 0,
            routes: tabMenuOptions,
        };
    }

    processAPIResponse() {
    }

    getRewards() {
        if (!this.props.isLoading && this.props.isConnected) {
            this.props.getRewards({}).then(() => {
                this.processAPIResponse();
            });
        }
    }

    getProfileDetails() {
        if (!this.props.isLoading && this.props.isConnected) {
            this.props.getProfileDetails({}).then(() => {
                this.processAPIResponse()
            });
        }
    }

    _handleChangeTab = (index) => {
        this.setState({
            index: index,
        });
    };

    _renderScene = ({route}) => {
        const profileTabProps = this.props;
        switch (route.key) {
            case '0':
                return <MyProfile {...profileTabProps}
                                  onPress={() => {
                                      console.log("profile on tab method");
                                      this.getProfileDetails();

                                  }}/>;
            case '1':
                return <MyRewards {...profileTabProps}
                                  onPress={() => {
                                      this.getRewards();
                                  }}/>;
            case '2':
                return <ShareProfile {...profileTabProps}
                                     onPress={() => {
                                         console.log("share profile on tab method");
                                     }}/>;
            default:
                return null;
        }
    };

    renderChild() {
        const profileTabProps = this.props;
        if (this.state.routes.length > 1) {
            return (
                <QPTabView
                    style={this.props.style}
                    navigationState={this.state}
                    renderScene={this._renderScene}
                    onIndexChange={this._handleChangeTab}

                />
            );
        } else if ((this.state.routes.length === 1) && (this.state.routes[0].key === "0")) {
            return <MyProfile {...profileTabProps}
                              onPress={() => {
                                  console.log("profile on tab method");
                                  this.getProfileDetails();

                              }}/>;
        }

    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
    return {
        profileData: state.panelProfileData,
        rewardsData: state.rewardsData,
        isLoading: state.isLoading,
        error: state.error.message,
        isConnected: state.network.isConnected,
        language: state.language.googleCode,
    };
}


export default connect(mapStateToProps, mapDispatchToProps)(Profile);
