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
        <TicketTab.Screen name="New" component={renderScene} initialParams={{ ticketCount: props.ticketCount, priorityCount: props.priorityCount}}/>
        <TicketTab.Screen name="Pending" component={renderScene} initialParams={{ ticketCount: props.ticketCount, priorityCount: props.priorityCount}}/>
        <TicketTab.Screen name="Escalated" component={renderScene} initialParams={{ ticketCount: props.ticketCount, priorityCount: props.priorityCount}}/>
        <TicketTab.Screen name="Resolved" component={renderScene} initialParams={{ ticketCount: props.ticketCount, priorityCount: props.priorityCount}}/>
    </TicketTab.Navigator>
);

const renderScene = (props) => {
    let renderDonutChart = () => {
        let victoryPieColorScale = [Colors.promoter, Colors.passive, Colors.high, Colors.critical];
        return (
            <View style={styles.chartContainer}>
                <View style={styles.donut}>
                    <VictoryPie
                        data={[
                            { y: '25', x: ''},
                            { y: '20', x: ''},
                            { y: '30', x: ''},
                            { y: '150', x: ''}
                        ]}
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
                        <Text style={[styles.npsPercentText]}>{getCount(props.route.params.ticketCount)}</Text>
                        <Text style={[styles.npsText]}>Tickets</Text>
                    </View>
                </View>
                {renderDonutInfoViewContainer()}
            </View>
        );
    };

    let getCount = (object) => {
        let name = props.route.name.toLowerCase();
        switch (name) {
            case 'new':
                return object.new;
            case 'pending':
                return object.pending || object.open;
            case 'escalated':
                return object.escalated;
            case 'resolved':
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
                <Text style={styles.viewTicketsText}>View Tickets</Text>
            </View>
            </TouchableWithoutFeedback>
        )
    };

    let renderDonutInfoViewContainer = () => {
        let routeName = props.route.name.toLowerCase();
        let priorities = getCount(props.route.params.priorityCount);
      return (
          <View style={{paddingTop: 2*PaddingConstants.tab4,}}>
              {renderTicketView(priorities.critical, Colors.critical, 'Critical')}
              {renderTicketView(priorities.high, Colors.high, 'High')}
              {renderTicketView(priorities.medium, Colors.passive, 'Medium')}
              {renderTicketView(priorities.low, Colors.promoter, 'Low')}
          </View>
      )
    };

    let renderTicketView = (count, color, status) => {
        return (
            <View style={styles.donutInfoContainer}>
                <Text style={styles.ticketText}>{count}</Text>
                <View style={[styles.ticketStatusView, {backgroundColor: color}]}>
                    <Text style={[styles.ticketStatusText,{color: status === 'Medium' ? Colors.primary : Colors.white}]}>{status}</Text>
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
