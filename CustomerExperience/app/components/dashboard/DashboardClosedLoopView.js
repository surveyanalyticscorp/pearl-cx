import React from 'react';
import {useWindowDimensions, StyleSheet, View, Text, TouchableWithoutFeedback} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {FontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {PaddingConstants} from '../../styles/padding.constants';
import DeviceInfo from 'react-native-device-info';
import {VictoryPie} from 'victory-native';
import {StackActions} from '@react-navigation/native';
import {translate} from "../../Utils/MultilinguaUtils";

export const DashboardClosedLoopView = (props) => {
    return <TicketTabStack {...props}/>
};

const TicketTab = createMaterialTopTabNavigator();
const TicketTabStack = props => (
    <TicketTab.Navigator tabBarOptions={{
        labelStyle: {width: useWindowDimensions().width/4, fontSize: TextSizes.secondary, fontFamily: FontFamily.regular},
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
        <TicketTab.Screen name = {translate("dashboard.new")} component={renderScene} initialParams={{index : 1, ticketCount: props.ticketCount}}/>
        <TicketTab.Screen name= {translate("dashboard.open")} component={renderScene} initialParams={{index : 2, ticketCount: props.ticketCount}}/>
        <TicketTab.Screen name= {translate("dashboard.escalated")} component={renderScene} initialParams={{index : 3, ticketCount: props.ticketCount}}/>
        <TicketTab.Screen name= {translate("dashboard.resolved")} component={renderScene} initialParams={{index : 4, ticketCount: props.ticketCount}}/>
    </TicketTab.Navigator>
);

const renderScene = (props) => {
    let renderDonutChart = () => {
        let count = getCount(props.route.params.ticketCount);
        let victoryPieColorScale = count.totalTickets > 0 ? [Colors.promoter, Colors.passive, Colors.high, Colors.critical]: [Colors.primary];
        let dataScale = count.totalTickets > 0 ? [
            { y: count.low, x: ''},
            { y: count.medium, x: ''},
            { y: count.high, x: ''},
            { y: count.critical, x: ''}
        ] : [ { y: 100, x: ''}];
        return (
            <View style={styles.chartContainer}>
                <View style={styles.donut}>
                    <VictoryPie
                        data={dataScale}
                        width={5*MarginConstants.tab4}
                        height={6*MarginConstants.tab4}
                        innerRadius={2.3*MarginConstants.tab4}
                        radius={2.1*MarginConstants.tab4}
                        style={{
                            labels: {
                                fill: 'transparent'
                            },
                        }}
                        colorScale={victoryPieColorScale}
                    />
                    <View style={styles.npsView}>
                        <Text style={[styles.npsPercentText]}>{count.totalTickets}</Text>
                        <Text style={[styles.npsText]}>{translate("dashboard.tickets")}</Text>
                    </View>
                </View>
                {renderDonutInfoViewContainer()}
            </View>
        );
    };

    let getCount = (object) => {
        //let name = props.route.name.toLowerCase();
        let index = props.route.params.index;
        console.log(`index: ${index}`);
        switch (index) {
            case 1:
                return object.new;
            case 2:
                return object.open;
            case 3:
                return object.escalated;
            case 4:
                return object.resolved;
        }
    };

    let renderViewTicketsContainer = () => {
        return (
            <TouchableWithoutFeedback onPress={() => {
                const pushAction = StackActions.push('Closed Loop', {
                    screen: props.route.name
                });
                props.navigation.dispatch(pushAction);
            }}>
            <View style={styles.viewTicketsContainer}>
                <Text style={styles.viewTicketsText}>{translate("dashboard.view_tickets")}</Text>
            </View>
            </TouchableWithoutFeedback>
        )
    };

    let renderDonutInfoViewContainer = () => {
        let priorities = getCount(props.route.params.ticketCount);
      return (
          <View style={{paddingTop: 2 * PaddingConstants.tab4}}>
              {renderTicketView(priorities.critical, Colors.critical, translate("dashboard.critical"), Colors.white)}
              {renderTicketView(priorities.high, Colors.high, translate("dashboard.high"), Colors.white)}
              {renderTicketView(priorities.medium, Colors.passive, translate("dashboard.medium"), Colors.primary)}
              {renderTicketView(priorities.low, Colors.promoter, translate("dashboard.low"), Colors.white)}
          </View>
      )
    };

    let renderTicketView = (count, bgColor, status, textColor) => {
        return (
            <View style={styles.donutInfoContainer}>
                <Text style={styles.ticketText}>{count}</Text>
                <View style={[styles.ticketStatusView, {backgroundColor: bgColor}]}>
                    <Text style={[styles.ticketStatusText,{color: textColor}]}>{status}</Text>
                </View>
            </View>
        )
    };

    return (
        <View style={styles.container}>
            {renderDonutChart()}
            {renderViewTicketsContainer()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.white,
        height: DeviceInfo.isTablet() ? MarginConstants.tab4 * 8 : MarginConstants.tab4 * 7,
        justifyContent: 'center',
    },
    chartContainer: {
        backgroundColor: Colors.white,
        height: DeviceInfo.isTablet() ? MarginConstants.tab4 * 6 : MarginConstants.tab4 * 5,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    donut: {
        marginTop: MarginConstants.tab4,
    },
    donutInfoContainer: {
        marginHorizontal: MarginConstants.tab1,
        paddingVertical: PaddingConstants.tab1,
    },
    viewTicketsContainer: {
        flex:1,
        width: '50%',
        marginHorizontal: MarginConstants.tab3,
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingBottom: PaddingConstants.tab3
    },
    viewTicketsText: {
        color: Colors.accent,
        padding:2
    },
    npsView: {
        position: 'absolute',
        left: '20%',
        top: DeviceInfo.isTablet() ? '40%' : '45%',
        width: 3*MarginConstants.tab4,
        paddingHorizontal: PaddingConstants.halfTab
    },
    npsPercentText: {
        color: Colors.primary,
        fontSize: 1.3*TextSizes.donutPercentText,
        fontFamily: FontFamily.bold,
        textAlign:'center',
    },
    npsText: {
        color: Colors.primary,
        fontSize: TextSizes.primary,
        fontFamily: FontFamily.semiBold,
        textAlign:'center',
    },
    ticketText: {
        color: Colors.primary,
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.semiBold,
        textAlign:'center',
        marginBottom: 2
    },
    ticketStatusView: {
        width: 2*MarginConstants.tab4,
        paddingVertical: 2,
        borderRadius: 15,
        alignItems:'center',
    },
    ticketStatusText: {
        color: Colors.white,
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.regular,
        textAlign:'center',
    }
});
