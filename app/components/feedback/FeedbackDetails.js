import React from 'react';
import {useWindowDimensions, StyleSheet, View} from 'react-native';
import FeedbackCell from './FeedbackCells';
import {Colors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import QPWebView from '../../widgets/QPWebView';
import {PaddingConstants} from '../../styles/padding.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {translate} from "../../Utils/MultilinguaUtils";

export default function FeedbackDetails(props){

    return (
        <View style={styles.container}>
            <FeedbackCell
                item={props.route.params.data}
                origin="Detail"
                ticketStatuses={props.route.params.ticketStatus}
                parentRoute={props.route.params.parentRoute}
                {...props}
            />
            <FeedbackDetailsTabStack {...props}/>
            {/** enable it when email functionality */}
            {/*<ActionButton*/}
                {/*buttonColor= {Colors.accent}*/}
                {/*buttonTextStyle={{fontSize: TextSizes.donutPercentText}}*/}
                {/*onPress={() => { alert("open email screen")}}*/}
                {/*renderIcon={() => {return <Icon size={30} name="email" color={Colors.white} />}}*/}
            {/*/>*/}
        </View>
    );
};

const DetailsTab = createMaterialTopTabNavigator();

const FeedbackDetailsTabStack = props => (
    <DetailsTab.Navigator tabBarOptions={{
        labelStyle: {width: useWindowDimensions().width/3, fontSize: TextSizes.secondary},
        indicatorStyle: {backgroundColor: Colors.accent},
        style:{backgroundColor: Colors.white, width: '100%'},
        initialLayout: {width: useWindowDimensions().width},
        tabStyle:{height: 1.5*PaddingConstants.tab4},
        activeTintColor: Colors.accent,
        inactiveTintColor: Colors.primary,
    }}
                          lazy
                          keyboardDismissMode={'auto'}
    >
        <DetailsTab.Screen name = {translate("responses.feedback")} component={renderScene}   initialParams={{ token: props.route.params.token, url: props.route.params.data.responseDataURL}}/>
        <DetailsTab.Screen name = {translate("responses.profile")} component={renderScene} initialParams={{ token: props.route.params.token, url: props.route.params.data.memberProfileURL}}/>
        <DetailsTab.Screen name = {translate("responses.activity")} component={renderScene} initialParams={{ token: props.route.params.token, url: props.route.params.data.activityURL}}/>
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
    }
});
