import React, {Component} from 'react';
import {
    Text,
    View,
    Image,
    TouchableHighlight
} from 'react-native';
import {Actions} from 'react-native-router-flux';


import styles from './styles';
import ActionButton from 'react-native-action-button';
import MyProfile from './MyProfile';
import FeedbackCell from '../feedbackCell';
import FeedbackSurvey from './FeedbackSurvey';
import FeedbackActivity from './FeedbackActivity';
import {ActionBarModule, AuthenticationModule} from '../../../../global/native-modules/NativeModules';
import SegmentControl from '../../../../global/segmentControl/SegmentControl';
import Icon from 'react-native-vector-icons/MaterialIcons'
const menuSegment = {
    FEEDBACK: 0,
    PROFILE: 1,
    ACTIVITY: 2
};

class FeedbackDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            selectedSegment: props.selectedSegment || menuSegment.FEEDBACK,
            data: props.feedbackDetail ? props.feedbackDetail : null,
            authToken: null,
        };

    }

    componentWillUnmount() {
        Actions.refresh();
        ActionBarModule.updateTitleAndMenu(
            JSON.stringify(this.props.titleAndMenuData)
        );
        ActionBarModule.toggleBackButton(false);
    }

    componentWillReceiveProps(props) {
        this.setState({data: props.feedbackDetail});
    }

    onTabChange = index => {
        this.setState({selectedSegment: index});
    };

    switchView = () => {
        switch (this.state.selectedSegment) {
            case menuSegment.FEEDBACK:
                return (<FeedbackSurvey uri={this.state.data.responseDataURL} authToken={this.props.authToken}/>);
            case menuSegment.PROFILE:
                return (<MyProfile uri={this.state.data.memberProfileURL} authToken={this.props.authToken}/>);
            case menuSegment.ACTIVITY:
                return (<FeedbackActivity uri={this.state.data.activityURL} authToken={this.props.authToken}/>);
            default:
                return (<View/>);

        }
    };

    _press = () => {
        ActionBarModule.updateTitleAndMenu(
            JSON.stringify({
                title: this.state.data.ticketID? 'Change Status' : 'Create Ticket',
            })
        );
        ActionBarModule.toggleBackButton(true);
        Actions.cxFeedbackUpdate({
            data: this.state.data,
            ticketStatuses: this.props.ticketStatuses
        });
    }

    render() {
        const data = this.state.data;
        return (

            <View style={{flex: 1, paddingTop: 5}}>
                <View style={{flex: 1}}>
                    <FeedbackCell
                        item={data}
                        origin="Detail"
                        ticketStatuses={this.props.ticketStatuses}
                    />
                    <SegmentControl
                        values={['Feedback', 'Profile', 'Activity']}
                        onValueChange={index => this.onTabChange(index)}
                        tintColor={'#187CE2'}
                        selectedIndex={this.state.selectedSegment}
                    />
                    <View style={{flex: 1}}>
                        {this.switchView()}
                    </View>
                </View>
                <ActionButton
                    elevation={8}
                    buttonColor="rgba(28,118,185,1)"
                    onPress={this._press}
                    icon = {
                         <Icon size={30} name='comment' color={'white'}/>
                    }
                >
                </ActionButton>
            </View>
        )

    }

}

export default FeedbackDetail;
