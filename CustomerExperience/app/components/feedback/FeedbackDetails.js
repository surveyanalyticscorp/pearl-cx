import React from 'react';
import {Dimensions, StyleSheet, View} from 'react-native';
import FeedbackCell from '../view/FeedbackCells';
import {Colors} from '../../styles/color.constants';
import {FontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';
import QPWebView from '../../widgets/QPWebView';
import {PaddingConstants} from '../../styles/padding.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {StackActions} from '@react-navigation/native';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';


let { width } = Dimensions.get('window');

export default function FeedbackDetails(props){

    const onActionButtonPress = () => {
        const pushAction = StackActions.push('Change Status', {
            data: props.route.params.data,
            ticketStatus: props.route.params.ticketStatus,
            token: props.route.params.token,
        });
        props.navigation.dispatch(pushAction);
    };
    return (
        <View style={styles.container}>
            <FeedbackCell
                item={props.route.params.data}
                origin="Detail"
                ticketStatuses={props.route.params.ticketStatus}
            />
            <FeedbackDetailsTabStack {...props}/>
            <ActionButton
                elevation={8}
                buttonColor= {Colors.accent}
                onPress={onActionButtonPress}
                icon={<Icon size={30} name="comment" color={Colors.white} />}
            />
        </View>
    );
};

const DetailsTab = createMaterialTopTabNavigator();

const FeedbackDetailsTabStack = props => (
    <DetailsTab.Navigator tabBarOptions={{
        labelStyle: {color: Colors.primary, width: width/3, fontSize: TextSizes.secondary},
        indicatorStyle: {backgroundColor: Colors.accent},
        style:{backgroundColor: Colors.white, width: '100%'},
        initialLayout: {width: Dimensions.get('window').width},
        tabStyle:{height: 1.5*PaddingConstants.tab4}
    }}
                          keyboardDismissMode={'auto'}
    >
        <DetailsTab.Screen name="Feedback" component={renderScene}   initialParams={{ token: props.route.params.token, url: props.route.params.data.responseDataURL}}/>
        <DetailsTab.Screen name="Profile" component={renderScene} initialParams={{ token: props.route.params.token, url: props.route.params.data.memberProfileURL}}/>
        <DetailsTab.Screen name="Activity" component={renderScene} initialParams={{ token: props.route.params.token, url: props.route.params.data.activityURL}}/>
    </DetailsTab.Navigator>
);

const renderScene = (props) => {
    return (
        <QPWebView
            authToken={props.route.params.token}
            uri={props.route.params.url}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 5
    },
    routeTitle: {
        color: Colors.primary,
        fontFamily: FontFamily.Light,
        fontSize: TextSizes.secondary,
        marginVertical: MarginConstants.halfTab,
    }

});
